import uuid
import json
from datetime import datetime
from sqlalchemy import String, Boolean, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    scam_type: Mapped[str] = mapped_column(String(100), nullable=True)
    tags: Mapped[str] = mapped_column(Text, default="[]")  # JSON string for SQLite
    like_count: Mapped[int] = mapped_column(Integer, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, default=0)
    is_verified_scam: Mapped[bool] = mapped_column(Boolean, default=False)
    scam_score: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    scan_result = relationship("ScanResult", back_populates="post", uselist=False, cascade="all, delete-orphan")

    @property
    def tags_list(self) -> list[str]:
        """Get tags as a list"""
        try:
            return json.loads(self.tags) if self.tags else []
        except:
            return []

    @tags_list.setter
    def tags_list(self, value: list[str]):
        """Set tags from a list"""
        self.tags = json.dumps(value)
