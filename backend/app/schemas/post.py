from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
from app.schemas.user import UserPublic


class ScanResultResponse(BaseModel):
    is_scam: bool
    confidence_score: int
    scam_type: str
    risk_level: str
    extracted_tags: List[str]
    analysis: str

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: uuid.UUID
    user: UserPublic
    content: str
    timestamp: str

    class Config:
        from_attributes = True


class PostCreate(BaseModel):
    description: Optional[str] = None


class PostResponse(BaseModel):
    id: uuid.UUID
    user: UserPublic
    imageUrl: str
    description: Optional[str]
    scamType: Optional[str]
    tags: List[str]
    timestamp: str
    likeCount: int
    commentCount: int
    isVerifiedScam: bool
    scamScore: int
    scanResult: Optional[ScanResultResponse] = None

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    posts: List[PostResponse]
    total: int
    page: int
    size: int


class AnalyzeResponse(BaseModel):
    scan_result: ScanResultResponse
    scam_score: int
