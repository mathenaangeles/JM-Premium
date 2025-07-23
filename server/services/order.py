from typing import Dict, List, Optional, Any, Tuple

from app import db
from services.cart import CartService
from models.order import Order, OrderItem
from services.address import AddressService
from services.payment import PaymentService
from models.product import Product, ProductVariant

class OrderService:
    def __init__(self):
        self.cart_service = CartService()
        self.address_service = AddressService()
        self.payment_service = PaymentService()

    def get_order_by_id(self, order_id: int) -> Optional[Order]:
        return db.session.get(Order, order_id)
    
    def get_order_by_id_and_email(self, order_id: int, email: str) -> Optional[Order]:
        return db.session.query(Order).filter(
            Order.id == order_id,
            Order.user_id.is_(None),
            Order.email == email
        ).first()
    
    def get_orders(self, page: int = 1, per_page: int = 10, user_id: Optional[int] = None, status: Optional[str] = None) -> Tuple[List[Order], int, int]:
        order_query = db.session.query(Order)
        if user_id:
            order_query = order_query.filter(Order.user_id == user_id)
        if status:
            order_query = order_query.filter(Order.status == status)
        count = order_query.count()
        total_pages = (count + per_page - 1) // per_page
        orders = order_query.order_by(Order.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
        return orders, count, total_pages
    
    def create_order_from_cart(self, data: Dict[str, Any], user_id: Optional[int]=None, session_id: Optional[int]=None) -> Dict[str, Any]:
        try:
            cart = self.cart_service.get_cart(user_id, session_id)
            if not cart or not cart.items:
                raise ValueError("Cart is empty")
            shipping_address_id = data.get('shipping_address_id')
            billing_address_id = data.get('billing_address_id')
            if not shipping_address_id:
                shipping_address = self.address_service.create_address({
                    'type': 'shipping',
                    'line_1': data.get('shipping_line_1'),
                    'line_2': data.get('shipping_line_2'),
                    'city': data.get('shipping_city'),
                    'zip_code': data.get('shipping_zip_code'),
                    'country': data.get('shipping_country'),
                }, user_id=user_id)
            else:
                shipping_address = self.address_service.get_address_by_id(shipping_address_id)
            if not billing_address_id:
                billing_address = self.address_service.create_address({
                    'type': 'billing',
                    'line_1': data.get('billing_line_1'),
                    'line_2': data.get('billing_line_2'),
                    'city': data.get('billing_city'),
                    'zip_code': data.get('billing_zip_code'),
                    'country': data.get('billing_country'),
                }, user_id=user_id)
            else:
                billing_address = self.address_service.get_address_by_id(billing_address_id)
            order = Order(
                user_id=user_id,
                session_id=session_id,
                shipping_method=data.get('shipping_method', 'standard'),
                shipping_address_id=shipping_address.id,
                billing_address_id=billing_address.id,
                status='awaiting_payment',
                total=0,
                subtotal=0,
                tax=data.get('tax'),
                shipping_cost=data.get('shipping_cost'),
                discount=data.get('discount', 0),
                email=data.get("email"),
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
                country_code=data.get("country_code"),
                phone_number=data.get("phone_number"),
            )
            db.session.add(order)
            db.session.flush()
            for cart_item in cart.items:
                product = db.session.query(Product).filter_by(id=cart_item.product_id).with_for_update().first()
                variant = db.session.query(ProductVariant).filter_by(id=cart_item.variant_id).with_for_update().first() if cart_item.variant_id else None
                if variant and variant.stock < cart_item.quantity:
                    raise ValueError(f"Not Enough Stock for Variant {variant.id}")
                elif not variant and product.total_stock < cart_item.quantity:
                    raise ValueError(f"Not Enough Stock for Product {product.id}")
                db.session.add(OrderItem(
                    order_id=order.id,
                    product_id=cart_item.product_id,
                    variant_id=cart_item.variant_id,
                    quantity=cart_item.quantity,
                    price=variant.price if variant else product.display_price
                ))
                if variant:
                    variant.stock -= cart_item.quantity
                else:
                    product.stock -= cart_item.quantity
            self.cart_service.clear_cart(user_id, session_id)
            order.set_totals()
            payment_result = self.payment_service.create_payment_request(
                amount=order.total,
                currency="PHP",
                user_id=user_id,
                order_id=order.id,
                payment_method=data.get("payment_method"),
                ewallet_type=data.get("ewallet_type"),
                card_number=data.get("card_number"),
                expiry_month=data.get("expiry_month"),
                expiry_year=data.get("expiry_year"),
                cvn=data.get("cvn"),
                cardholder_name=data.get("cardholder_name"),
                cardholder_email=data.get("cardholder_email"),
                skip_three_ds=data.get("skip_three_ds"),
            )
            if not payment_result.get("success"):
                raise ValueError(payment_result.get("error", "Unknown Payment Failure"))
            payment = payment_result["payment"]
            order.payment_id = payment.id
            order.status = 'processing'
            db.session.commit()
            return {
                "success": True,
                "order": order,
                "payment": payment,
                "checkout_url": next(
                    (action["url"] for action in payment_result.get("actions", []) if action.get("url_type") == "CHECKOUT"),
                    None
                )
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": str(e)
            }
        
    def update_order(self, order_id: int, payment_id: Optional[int]=None, status: Optional[str] = None, tracking_number: Optional[str] = None) -> Optional[Order]:
        order = self.get_order_by_id(order_id)
        if not order:
            return None
        if status:
            order.status = status
        if tracking_number:
            order.tracking_number = tracking_number
        db.session.commit()
        return order
    
    def cancel_order(self, order: Order) -> Optional[Order]:
        if not order or order.status not in ['pending']:
            return None
        for order_item in order.items:
            product = db.session.query(Product).filter_by(id=order_item.product_id).with_for_update().one()
            variant = db.session.query(ProductVariant).filter_by(id=order_item.variant_id).with_for_update().one()
            if variant:
                variant.stock += order_item.quantity
            elif product:
                product.stock += order_item.quantity
        order.status = 'cancelled'
        db.session.commit()
        return order
    
    def user_has_purchased(self, user_id: int, product_id: int) -> bool:
        return db.session.query(Order).join(OrderItem).filter(
            Order.user_id == user_id,
            OrderItem.product_id == product_id,
            Order.status.in_(['delivered', 'completed'])
        ).first() is not None
    
    def serialize_order_item(self, order_item: OrderItem) -> Dict[str, Any]:
        return order_item.to_dict()
    
    def serialize_order(self, order: Order) -> Dict[str, Any]:
        return order.to_dict()
