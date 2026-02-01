from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import date, datetime, timedelta
from app.models.wallet import Wallet, WalletTransaction, DailyActivity
from app.config import settings


async def get_or_create_wallet(db: AsyncSession, user_id) -> Wallet:
    """Get existing wallet or create new one for user"""
    result = await db.execute(select(Wallet).where(Wallet.user_id == user_id))
    wallet = result.scalar_one_or_none()

    if not wallet:
        wallet = Wallet(user_id=user_id)
        db.add(wallet)
        await db.flush()

    return wallet


async def check_daily_activity(db: AsyncSession, user_id, activity_type: str) -> bool:
    """Check if user has already done activity today"""
    today = date.today()
    result = await db.execute(
        select(DailyActivity).where(
            and_(
                DailyActivity.user_id == user_id,
                DailyActivity.activity_type == activity_type,
                DailyActivity.activity_date == today
            )
        )
    )
    return result.scalar_one_or_none() is not None


async def record_daily_activity(db: AsyncSession, user_id, activity_type: str) -> bool:
    """Record daily activity, returns False if already done today"""
    if await check_daily_activity(db, user_id, activity_type):
        return False

    activity = DailyActivity(
        user_id=user_id,
        activity_type=activity_type,
        activity_date=date.today()
    )
    db.add(activity)
    return True


async def add_points(
    db: AsyncSession,
    user_id,
    amount: int,
    transaction_type: str,
    description: str = None
) -> Wallet:
    """Add points to user's wallet and record transaction"""
    wallet = await get_or_create_wallet(db, user_id)
    wallet.balance += amount

    if transaction_type == "report":
        wallet.total_reports += 1
    elif transaction_type == "quiz":
        wallet.total_quizzes += 1

    transaction = WalletTransaction(
        wallet_id=wallet.id,
        amount=amount,
        type=transaction_type,
        description=description
    )
    db.add(transaction)

    return wallet


async def reward_for_report(db: AsyncSession, user_id) -> tuple[bool, int]:
    """
    Give reward for scam report (once per day)
    Returns (success, points_earned)
    """
    if not await record_daily_activity(db, user_id, "report"):
        return False, 0

    points = settings.REWARD_REPORT
    await add_points(db, user_id, points, "report", "Daily scam report reward")
    return True, points


async def reward_for_quiz(db: AsyncSession, user_id, points: int) -> tuple[bool, int]:
    """Give reward for quiz correct answer"""
    await add_points(db, user_id, points, "quiz", "Quiz correct answer")
    return True, points


async def get_weekly_history(db: AsyncSession, user_id) -> list[dict]:
    """Get weekly point history for chart"""
    wallet = await get_or_create_wallet(db, user_id)

    # Get transactions from last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    result = await db.execute(
        select(WalletTransaction)
        .where(
            and_(
                WalletTransaction.wallet_id == wallet.id,
                WalletTransaction.created_at >= week_ago
            )
        )
        .order_by(WalletTransaction.created_at)
    )
    transactions = result.scalars().all()

    # Group by day
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    day_names_kr = ["월", "화", "수", "목", "금", "토", "일"]

    daily_totals = {i: 0 for i in range(7)}
    daily_types = {i: "report" for i in range(7)}

    for tx in transactions:
        weekday = tx.created_at.weekday()
        daily_totals[weekday] += tx.amount
        daily_types[weekday] = tx.type

    return [
        {"day": day_names_kr[i], "amount": daily_totals[i], "type": daily_types[i]}
        for i in range(7)
    ]
