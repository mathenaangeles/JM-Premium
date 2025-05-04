import uuid
from sqlalchemy.orm import joinedload
from typing import Dict, Optional, Any
from sqlalchemy.exc import SQLAlchemyError


from app import db
from models.cart import Cart, CartItem
from models.product import ProductVariant

class CartService:
    def create_cart(self, user_id: Optional[int] = None, session_id: Optional[str] = None) -> Cart:
        cart = Cart(user_id=user_id, session_id=session_id)
        db.session.add(cart)
        db.session.commit()
        return cart
    
    def get_cart(self, user_id: Optional[int] = None, session_id: Optional[str] = None) -> Cart:
        try:
            if user_id:
                cart = (
                    db.session.query(Cart)
                    .options(
                        joinedload(Cart.items).joinedload(CartItem.variant),
                        joinedload(Cart.items).joinedload(CartItem.product)
                    )
                    .filter_by(user_id=user_id)
                    .with_for_update()
                    .first()
                )
                if not cart:
                    cart = self.create_cart(user_id=user_id, session_id=session_id)
                if session_id:
                    anonymous_cart = db.session.query(Cart).filter(
                        Cart.session_id == session_id,
                        Cart.user_id == None
                    ).with_for_update().first()
                    if anonymous_cart:
                        self.merge_carts(anonymous_cart, cart)
                        db.session.delete(anonymous_cart)
            elif session_id:
                cart = db.session.query(Cart).filter_by(session_id=session_id).first()
                if not cart:
                    cart = self.create_cart(session_id=session_id)
            else:
                cart = self.create_cart(session_id=str(uuid.uuid4()))
            return cart
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
    
    def merge_carts(self, source_cart: Cart, target_cart: Cart) -> None:
        for source_item in source_cart.items:
            target_item = next(
                (item for item in target_cart.items if item.product_id == source_item.product_id), 
                None
            )
            if target_item:
                target_item.quantity += source_item.quantity
            else:
                new_item = CartItem(
                    cart_id=target_cart.id,
                    product_id=source_item.product_id,
                    quantity=source_item.quantity
                )
                db.session.add(new_item)
    
    def add_to_cart(self, product_id: int, variant_id: int, quantity: int = 1, user_id: Optional[int] = None, session_id: Optional[str] = None) -> Optional[CartItem]:
        if variant_id:
            variant = db.session.get(ProductVariant, variant_id)
            if not variant:
                return None
            product_id = variant.product_id
        else:
            product_id = product_id
            variant = None
        cart = self.get_cart(user_id=user_id, session_id=session_id)
        cart_item = db.session.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id,
            CartItem.variant_id == variant_id
        ).first()
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                variant_id=variant.id if variant else None,
                quantity=quantity
            )
            db.session.add(cart_item)
        db.session.commit()
        return cart_item
    
    def update_cart_item(self, cart_item_id: int, quantity: int, user_id: Optional[int] = None, session_id: Optional[str] = None) -> Optional[CartItem]:
        cart = self.get_cart(user_id=user_id, session_id=session_id)
        cart_item = db.session.query(CartItem).filter(
            CartItem.id == cart_item_id,
            CartItem.cart_id == cart.id
        ).first()
        if not cart_item:
            return None
        if quantity <= 0:
            db.session.delete(cart_item)
        else:
            cart_item.quantity = quantity
        db.session.commit()
        return cart_item if quantity > 0 else None
    
    def remove_from_cart(self, cart_item_id: int, user_id: Optional[int] = None, session_id: Optional[str] = None) -> bool:
        cart = self.get_cart(user_id=user_id, session_id=session_id)
        cart_item = db.session.query(CartItem).filter(
            CartItem.id == cart_item_id,
            CartItem.cart_id == cart.id
        ).first()
        if not cart_item:
            return False
        db.session.delete(cart_item)
        db.session.commit()
        return True
    
    def clear_cart(self, user_id: Optional[int] = None, session_id: Optional[str] = None) -> bool:
        cart = self.get_cart(user_id=user_id, session_id=session_id)
        db.session.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.session.commit()
        return True
    
    def serialize_cart_item(self, cart_item: CartItem) -> Dict[str, Any]:
        cart_item_data = cart_item.to_dict()
        cart_item_data.update({
            "product_name": cart_item.product.name,
            "variant_name": cart_item.variant.name,
        })
        return cart_item_data
    
    def serialize_cart(self, cart: Cart) -> Dict[str, Any]:
        return cart.to_dict()