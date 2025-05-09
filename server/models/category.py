from typing import  List, Optional, Dict, Any
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin

class Category(Base, TimestampMixin):
    __tablename__ = "categories"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    parent_category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"))

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False) 

    image: Mapped[Optional["CategoryImage"]] = relationship(back_populates="category", uselist=False, cascade="all, delete-orphan")
    products: Mapped[List["Product"]] = relationship(back_populates="category")
    subcategories: Mapped[List["Category"]] = relationship(back_populates="parent_category")
    parent_category: Mapped[Optional["Category"]] = relationship(back_populates="subcategories", remote_side=[id])

    def __repr__(self) -> str:
        return f'<Category {self.name}>'
    
    def to_dict(self, include_subcategories=False) -> Dict[str, Any]:
        data = {
            'id': self.id,
            'parent_category_id': self.parent_category_id,
            'name': self.name,
            'description': self.description,
            'slug': self.slug,
            'image': self.image.to_dict() if self.image else None,
            'product_count': len(self.products) + sum(len(subcategory.products) for subcategory in self.subcategories),
        }
        if include_subcategories:
            subcategories = self.subcategories if self.subcategories is not None else []
            data['subcategories'] = [subcategory.to_dict(True) for subcategory in subcategories]
        return data
    
class CategoryImage(Base, TimestampMixin):
    __tablename__ = "category_images"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)

    url: Mapped[str] = mapped_column(String(255), nullable=False)

    category: Mapped["Category"] = relationship(back_populates="image")
    
    def __repr__(self) -> str:
        return f'<CategoryImage {self.url}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "category_id": self.category_id,
            "url": self.url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
