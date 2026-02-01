import uuid
import json
from datetime import datetime
from sqlalchemy import String, Boolean, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    post_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("posts.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    is_scam: Mapped[bool] = mapped_column(Boolean, nullable=False)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False)
    scam_type: Mapped[str] = mapped_column(String(100), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    extracted_tags: Mapped[str] = mapped_column(Text, default="[]")  # JSON string for SQLite
    analysis: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    post = relationship("Post", back_populates="scan_result")

    @property
    def extracted_tags_list(self) -> list[str]:
        """Get extracted_tags as a list"""
        try:
            return json.loads(self.extracted_tags) if self.extracted_tags else []
        except:
            return []

    @extracted_tags_list.setter
    def extracted_tags_list(self, value: list[str]):
        """Set extracted_tags from a list"""
        self.extracted_tags = json.dumps(value)
