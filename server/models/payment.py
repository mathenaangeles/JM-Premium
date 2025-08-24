from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, Numeric, ForeignKey, JSON

from models.base import Base, TimestampMixin

class Payment(Base, TimestampMixin):
    __tablename__ = "payments"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)

    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(255), default='pending', nullable=False)
    payment_method: Mapped[str] = mapped_column(String(255), nullable=False)
    payment_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    reference_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    xendit_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    session_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    payment_request_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    payment_details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    user: Mapped["User"] = relationship()
    
    def __repr__(self) -> str:
        return f'<Payment {self.id} {self.status}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "amount": float(self.amount),
            "currency": self.currency,
            "status": self.status,
            "payment_method": self.payment_method,
            "reference_id": self.reference_id,
            "xendit_id": self.xendit_id,
            "session_data": self.session_data,
            "payment_request_id": self.payment_request_id,
            "payment_details": self.payment_details,
            "user": self.user.to_dict() if self.user else None,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }