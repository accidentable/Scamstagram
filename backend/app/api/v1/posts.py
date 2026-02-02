import uuid
import os
import base64
import aiofiles
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from typing import Optional
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment, Like
from app.models.scan_result import ScanResult
from app.schemas.post import (
    PostResponse, PostListResponse, CommentCreate, CommentResponse,
    ScanResultResponse, AnalyzeResponse
)
from app.schemas.user import UserPublic
from app.api.deps import get_current_user
from app.services.gemini_service import analyze_scam_image, calculate_scam_score, ScanResultData, generate_post_description
from app.services.wallet_service import reward_for_report
from app.config import settings

router = APIRouter(prefix="/posts", tags=["Posts"])


def format_timestamp(dt: datetime) -> str:
    """Format datetime to relative time string"""
    now = datetime.utcnow()
    diff = now - dt

    if diff.days > 0:
        return f"{diff.days}일 전"
    elif diff.seconds >= 3600:
        return f"{diff.seconds // 3600}시간 전"
    elif diff.seconds >= 60:
        return f"{diff.seconds // 60}분 전"
    else:
        return "방금 전"


def post_to_response(post: Post) -> PostResponse:
    """Convert Post model to response schema"""
    user_public = UserPublic(
        id=post.user.id,
        username=post.user.username,
        avatar=post.user.avatar,
        level=post.user.level,
        is_verified=post.user.is_verified
    )

    scan_result = None
    if post.scan_result:
        scan_result = ScanResultResponse(
            is_scam=post.scan_result.is_scam,
            confidence_score=post.scan_result.confidence_score,
            scam_type=post.scan_result.scam_type,
            risk_level=post.scan_result.risk_level,
            extracted_tags=post.scan_result.extracted_tags or [],
            analysis=post.scan_result.analysis or ""
        )

    return PostResponse(
        id=post.id,
        user=user_public,
        imageUrl=post.image_url,
        description=post.description,
        scamType=post.scam_type,
        tags=post.tags or [],
        timestamp=format_timestamp(post.created_at),
        likeCount=post.like_count,
        commentCount=post.comment_count,
        isVerifiedScam=post.is_verified_scam,
        scamScore=post.scam_score,
        scanResult=scan_result
    )


@router.get("/", response_model=PostListResponse)
async def get_posts(
    page: int = 1,
    size: int = 10,
    scam_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get paginated feed of posts"""
    offset = (page - 1) * size

    query = select(Post).options(
        selectinload(Post.user),
        selectinload(Post.scan_result)
    ).order_by(desc(Post.created_at))

    if scam_type:
        query = query.where(Post.scam_type == scam_type)

    # Get total count
    count_result = await db.execute(select(Post))
    total = len(count_result.scalars().all())

    # Get paginated posts
    result = await db.execute(query.offset(offset).limit(size))
    posts = result.scalars().all()

    return PostListResponse(
        posts=[post_to_response(p) for p in posts],
        total=total,
        page=page,
        size=size
    )


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    image: UploadFile = File(...),
    description: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new post with image upload and AI analysis"""
    # Validate image type
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )

    # Save image file
    file_ext = image.filename.split(".")[-1] if "." in image.filename else "jpg"
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Read file content
    content = await image.read()

    # Save to disk
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    # Convert to base64 for AI analysis
    base64_data = base64.b64encode(content).decode("utf-8")

    # AI Analysis
    scan_data: ScanResultData = await analyze_scam_image(base64_data, image.content_type)
    scam_score = calculate_scam_score(scan_data.risk_level, scan_data.confidence_score)

    # Create post
    post = Post(
        user_id=current_user.id,
        image_url=f"/uploads/images/{filename}",
        description=description,
        scam_type=scan_data.scam_type,
        tags=scan_data.extracted_tags,
        scam_score=scam_score,
        is_verified_scam=scan_data.is_scam and scan_data.confidence_score >= 70
    )
    db.add(post)
    await db.flush()

    # Create scan result
    scan_result = ScanResult(
        post_id=post.id,
        is_scam=scan_data.is_scam,
        confidence_score=scan_data.confidence_score,
        scam_type=scan_data.scam_type,
        risk_level=scan_data.risk_level,
        extracted_tags=scan_data.extracted_tags,
        analysis=scan_data.analysis
    )
    db.add(scan_result)

    # Reward points (once per day)
    rewarded, points = await reward_for_report(db, current_user.id)

    await db.commit()

    # Reload with relationships
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.user), selectinload(Post.scan_result))
        .where(Post.id == post.id)
    )
    post = result.scalar_one()

    return post_to_response(post)


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Analyze image without creating post (preview)"""
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )

    content = await image.read()
    base64_data = base64.b64encode(content).decode("utf-8")

    scan_data = await analyze_scam_image(base64_data, image.content_type)
    scam_score = calculate_scam_score(scan_data.risk_level, scan_data.confidence_score)

    return AnalyzeResponse(
        scan_result=ScanResultResponse(
            is_scam=scan_data.is_scam,
            confidence_score=scan_data.confidence_score,
            scam_type=scan_data.scam_type,
            risk_level=scan_data.risk_level,
            extracted_tags=scan_data.extracted_tags,
            analysis=scan_data.analysis
        ),
        scam_score=scam_score
    )


class AnalyzeJsonRequest(BaseModel):
    image_data: str
    mime_type: str




@router.post("/analyze-json", response_model=AnalyzeResponse)
async def analyze_image_json(
    request: AnalyzeJsonRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Analyze image from base64 JSON payload and auto-post if risk >= 40%"""
    try:
        print(f"[analyze-json] Starting analysis for user: {current_user.id}")
        print(f"[analyze-json] Image data length: {len(request.image_data)}, mime_type: {request.mime_type}")
        
        scan_data = await analyze_scam_image(request.image_data, request.mime_type)
        print(f"[analyze-json] Scan completed: is_scam={scan_data.is_scam}, confidence={scan_data.confidence_score}")
        
        scam_score = calculate_scam_score(scan_data.risk_level, scan_data.confidence_score)
        print(f"[analyze-json] Calculated scam_score: {scam_score}")

        rewarded = False
        points_earned = 0
        post_id = None

        # 위험도 40% 이상이면 자동으로 피드에 게시하고 포인트 지급
        if scam_score >= 40:
            print(f"[analyze-json] Score >= 40, creating post...")
            # AI로 글 자동 작성
            ai_description = await generate_post_description(scan_data)
            
            # 이미지를 파일로 저장
            file_ext = request.mime_type.split("/")[-1] if "/" in request.mime_type else "jpg"
            filename = f"{uuid.uuid4()}.{file_ext}"
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            
            # Base64 디코딩 후 저장
            clean_base64 = request.image_data.split(",")[1] if "," in request.image_data else request.image_data
            image_bytes = base64.b64decode(clean_base64)
            
            async with aiofiles.open(file_path, "wb") as f:
                await f.write(image_bytes)
            
            # 포스트 생성
            post = Post(
                user_id=current_user.id,
                image_url=f"/uploads/images/{filename}",
                description=ai_description,
                scam_type=scan_data.scam_type,
                tags=scan_data.extracted_tags,
                scam_score=scam_score,
                is_verified_scam=scan_data.is_scam and scan_data.confidence_score >= 70
            )
            db.add(post)
            await db.flush()
            
            # 스캔 결과 저장
            scan_result_db = ScanResult(
                post_id=post.id,
                is_scam=scan_data.is_scam,
                confidence_score=scan_data.confidence_score,
                scam_type=scan_data.scam_type,
                risk_level=scan_data.risk_level,
                extracted_tags=scan_data.extracted_tags,
                analysis=scan_data.analysis
            )
            db.add(scan_result_db)
            
            # 포인트 지급 (하루 1회)
            rewarded, points_earned = await reward_for_report(db, current_user.id)
            
            await db.commit()
            post_id = str(post.id)
            print(f"[analyze-json] Post created: {post_id}, rewarded: {rewarded}")

        print(f"[analyze-json] Returning response with scam_score: {scam_score}")
        return AnalyzeResponse(
            scan_result=ScanResultResponse(
                is_scam=scan_data.is_scam,
                confidence_score=scan_data.confidence_score,
                scam_type=scan_data.scam_type,
                risk_level=scan_data.risk_level,
                extracted_tags=scan_data.extracted_tags,
                analysis=scan_data.analysis
            ),
            scam_score=scam_score
        )
    except Exception as e:
        import traceback
        print(f"[analyze-json] ERROR: {type(e).__name__}: {e}")
        print(f"[analyze-json] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single post by ID"""
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.user), selectinload(Post.scan_result))
        .where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    return post_to_response(post)


@router.post("/{post_id}/like")
async def toggle_like(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle like on a post"""
    # Check if post exists
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if already liked
    result = await db.execute(
        select(Like).where(
            Like.post_id == post_id,
            Like.user_id == current_user.id
        )
    )
    existing_like = result.scalar_one_or_none()

    if existing_like:
        # Unlike
        await db.delete(existing_like)
        post.like_count = max(0, post.like_count - 1)
        liked = False
    else:
        # Like
        like = Like(post_id=post_id, user_id=current_user.id)
        db.add(like)
        post.like_count += 1
        liked = True

    await db.commit()

    return {"liked": liked, "like_count": post.like_count}


@router.get("/{post_id}/comments", response_model=list[CommentResponse])
async def get_comments(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comments for a post"""
    result = await db.execute(
        select(Comment)
        .options(selectinload(Comment.user))
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at)
    )
    comments = result.scalars().all()

    return [
        CommentResponse(
            id=c.id,
            user=UserPublic(
                id=c.user.id,
                username=c.user.username,
                avatar=c.user.avatar,
                level=c.user.level,
                is_verified=c.user.is_verified
            ),
            content=c.content,
            timestamp=format_timestamp(c.created_at)
        )
        for c in comments
    ]


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: uuid.UUID,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create comment on a post"""
    # Check if post exists
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_data.content
    )
    db.add(comment)
    post.comment_count += 1

    await db.commit()
    await db.refresh(comment)

    return CommentResponse(
        id=comment.id,
        user=UserPublic(
            id=current_user.id,
            username=current_user.username,
            avatar=current_user.avatar,
            level=current_user.level,
            is_verified=current_user.is_verified
        ),
        content=comment.content,
        timestamp="방금 전"
    )


@router.get("/stats/trending")
async def get_trending_scam_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get trending scam types"""
    result = await db.execute(
        select(Post.scam_type)
        .where(Post.scam_type.isnot(None))
        .order_by(desc(Post.created_at))
        .limit(100)
    )
    scam_types = result.scalars().all()

    # Count occurrences
    type_counts = {}
    for st in scam_types:
        type_counts[st] = type_counts.get(st, 0) + 1

    # Sort by count
    trending = sorted(type_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    return [{"type": t, "count": c} for t, c in trending]


@router.get("/stats/summary")
async def get_stats_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get overall statistics"""
    from sqlalchemy import func
    from datetime import date

    today = date.today()

    # Today's reports
    today_result = await db.execute(
        select(func.count(Post.id))
        .where(func.date(Post.created_at) == today)
    )
    today_reports = today_result.scalar() or 0

    # Total users (mock active hunters)
    user_result = await db.execute(select(func.count(User.id)))
    total_users = user_result.scalar() or 0

    return {
        "today_reports": today_reports,
        "active_hunters": total_users,
        "prevention_rate": 89  # Mock value
    }
