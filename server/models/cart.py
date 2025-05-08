from typing import List, Optional, Dict, Any
from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin

class Cart(Base, TimestampMixin):
    __tablename__ = "carts"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    session_id: Mapped[Optional[str]] = mapped_column(String(255))

    user: Mapped[Optional["User"]] = relationship(back_populates="cart")
    items: Mapped[List["CartItem"]] = relationship(back_populates="cart", cascade="all, delete-orphan")
    
    @property
    def subtotal(self) -> float:
        return float(sum(item.subtotal for item in self.items))
        
    def __repr__(self) -> str:
        return f'<Cart {self.id}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "subtotal": self.subtotal,
            "items": [item.to_dict() for item in self.items],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class CartItem(Base, TimestampMixin):
    __tablename__ = "cart_items"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey("carts.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id"), nullable=True)

    quantity: Mapped[int] = mapped_column(Integer, default=1)
    
    cart: Mapped["Cart"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
    variant: Mapped["ProductVariant"] = relationship()
    
    @property
    def price(self) -> float:
        return float(self.variant.price) if self.variant else self.product.display_price
    
    @property
    def subtotal(self) -> float:
        return float(self.price * self.quantity)
    
    @property
    def in_stock(self) -> bool:
        return self.product.total_stock >= self.quantity
    
    def __repr__(self) -> str:
        return f'<CartItem {self.product.name} ({self.quantity})>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "product_id": self.product_id,
            "variant_id": self.variant_id,
            "quantity": self.quantity,
            "price": self.price,
            "subtotal": self.subtotal,
            "in_stock": self.in_stock,
            "product": self.product.to_dict() if self.product else None,
            "variant": self.variant.to_dict() if self.variant else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }