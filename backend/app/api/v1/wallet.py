from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.wallet import WalletResponse, WalletDetailResponse, WeeklyActivityItem
from app.api.deps import get_current_user
from app.services.wallet_service import (
    get_or_create_wallet,
    check_daily_activity,
    get_weekly_history
)

router = APIRouter(prefix="/wallet", tags=["Wallet"])


@router.get("/", response_model=WalletDetailResponse)
async def get_wallet(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's wallet info with weekly history"""
    wallet = await get_or_create_wallet(db, current_user.id)

    today_reported = await check_daily_activity(db, current_user.id, "report")
    today_quiz = await check_daily_activity(db, current_user.id, "quiz")

    history = await get_weekly_history(db, current_user.id)

    return WalletDetailResponse(
        balance=wallet.balance,
        total_reports=wallet.total_reports,
        total_quizzes=wallet.total_quizzes,
        today_reported=today_reported,
        today_quiz_completed=today_quiz,
        history=[WeeklyActivityItem(**h) for h in history]
    )


@router.get("/status")
async def get_daily_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check daily activity status"""
    today_reported = await check_daily_activity(db, current_user.id, "report")
    today_quiz = await check_daily_activity(db, current_user.id, "quiz")

    return {
        "today_reported": today_reported,
        "today_quiz_completed": today_quiz
    }
