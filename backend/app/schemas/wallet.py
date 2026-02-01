from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid


class WalletResponse(BaseModel):
    balance: int
    total_reports: int
    total_quizzes: int
    today_reported: bool
    today_quiz_completed: bool

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: uuid.UUID
    amount: int
    type: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class WalletHistoryResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int


class WeeklyActivityItem(BaseModel):
    day: str
    amount: int
    type: str


class WalletDetailResponse(BaseModel):
    balance: int
    total_reports: int
    total_quizzes: int
    today_reported: bool
    today_quiz_completed: bool
    history: List[WeeklyActivityItem]
