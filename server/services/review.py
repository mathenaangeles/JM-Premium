from sqlalchemy.orm import joinedload
from typing import Dict, List, Optional, Any, Tuple

from app import db
from models.review import Review
from models.product import Product
from services.user import UserService
from services.order import OrderService
from services.product import ProductService

class ReviewService:
    def __init__(self):
        self.product_service = ProductService()
        self.order_service = OrderService()
        self.user_service = UserService()

    def get_review_by_id(self, review_id: int) -> Optional[Review]:
        return db.session.query(Review).join(Product, Product.id == Review.product_id).filter(Review.id == review_id).first()
    
    def get_review_by_id_and_user_id(self, review_id: int, user_id: int) -> Optional[Review]:
        return db.session.query(Review).join(Product, Product.id == Review.product_id).filter(
            Review.id == review_id,
            Review.user_id == user_id
        ).first()
    
    def get_reviews(self, page: int = 1, per_page: int = 10, user_id: Optional[int]=None, product_id:  Optional[int]=None, approved: Optional[bool] = None, verified: Optional[bool] = None) -> Tuple[List[Review], int, int]:
        review_query = db.session.query(Review).join(Product, Product.id == Review.product_id)
        if product_id:
            review_query = review_query.filter(Review.product_id == product_id)
        if user_id:
            review_query = review_query.filter(Review.user_id == user_id)
        if approved is not None:
            review_query = review_query.filter(Review.is_approved == approved)
        if verified is not None:
            review_query = review_query.filter(Review.is_verified == verified)
        count = review_query.count()
        total_pages = (count + per_page - 1) // per_page
        reviews = review_query.order_by(Review.rating.desc()).offset((page - 1) * per_page).limit(per_page).all()
        return reviews, count, total_pages

    def create_review(self, user_id: int, product_id: int, data: Dict[str, Any]) -> Optional[Review]:
        product = self.product_service.get_product_by_id(product_id)
        if not product:
            return None
        user_has_purchased = self.order_service.user_has_purchased(user_id, product_id)
        review = Review(
            user_id=user_id,
            product_id=product_id,
            rating=data.get('rating'),
            title=data.get('title', ''),
            content=data.get('content', ''),
            is_verified=True if user_has_purchased else False,
            is_approved=True if user_has_purchased else False
        )
        db.session.add(review)
        db.session.commit()
        return review
    
    def update_review(self, review_id: int, user_id: int, data: Dict[str, Any]) -> Optional[Review]:
        review = self.get_review_by_id_and_user_id(review_id, user_id)
        if not review:
            return None
        for field in ['rating', 'title', 'content']:
            if field in data:
                setattr(review, field, data[field])
        user = self.user_service.get_user_by_id(user_id)
        for field in ['is_approved', 'is_verified']:
            if field in data and user.is_admin:
                setattr(review, field, data[field])
        db.session.commit()
        return review
    
    def delete_review(self, review: Review) -> bool:
        db.session.delete(review)
        db.session.commit()
        return True
    
    def serialize_review(self, review: Review) -> Dict[str, Any]:
        serialized_review = review.to_dict()
        if review.product:
            serialized_review['product'] = {
                'name': review.product.name,
            }
        return serialized_review