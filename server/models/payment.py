from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, Numeric, ForeignKey, func

from models.base import Base, TimestampMixin

class Payment(Base, TimestampMixin):
    __tablename__ = "payments"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)

    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(255), default='pending', nullable=False)
    payment_method: Mapped[str] = mapped_column(String(255), nullable=False)
    transaction_id: Mapped[str] = mapped_column(String(255), nullable=False)
    payment_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), server_default=func.now())

    external_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    xendit_invoice_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    invoice_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

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
            "transaction_id": self.transaction_id,
            "user": self.user.to_dict() if self.user else None,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "external_id": self.external_id,
            "xendit_invoice_id": self.xendit_invoice_id,
            "invoice_url": self.invoice_url,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }