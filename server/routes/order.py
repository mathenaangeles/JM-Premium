from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from services.user import UserService
from services.order import OrderService
from services.payment import PaymentService
from middlewares.user import auth_required, admin_required

order_blueprint = Blueprint('order', __name__, url_prefix='/orders')
order_service = OrderService()
user_service = UserService()
payment_service = PaymentService()

@order_blueprint.route('/', methods=['GET'])
@auth_required
def get_orders():
    user_id = int(get_jwt_identity())
    status = request.args.get('status', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    try:
        orders, count, total_pages = order_service.get_orders(page, per_page, user_id, status)
        return jsonify({
            'orders': [order_service.serialize_order(order) for order in orders],
            'count': count,
            'total_pages': total_pages,
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Orders could not be fetched.'}), 500
    
@order_blueprint.route('/admin', methods=['GET'])
@admin_required
def get_all_orders():
    status = request.args.get('status', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    try:
        orders, count, total_pages = order_service.get_orders(page, per_page, None, status)
        return jsonify({
            'orders': [order_service.serialize_order(order) for order in orders],
            'count': count,
            'total_pages': total_pages,
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Orders could not be fetched.'}), 500

@order_blueprint.route('/<int:order_id>', methods=['GET'])
@auth_required
def get_order(order_id):
    user_id = int(get_jwt_identity())
    user = user_service.get_user_by_id(user_id)
    try:
        order = order_service.get_order_by_id(order_id)
        if not order:
            return jsonify({'message': 'Order could not be found'}), 404
        if order.user_id != user_id and not user.is_admin:
            return jsonify({'message': 'Unauthorized Access'}), 403
        return jsonify({
            "order": order_service.serialize_order(order)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Order could not be fetched'}), 500
    
@order_blueprint.route('/guest/<int:order_id>', methods=['GET'])
def get_order_by_email(order_id):
    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Email address is required.'}), 400
    try:
        order = order_service.get_order_by_id_and_email(order_id, email)
        if not order:
            return jsonify({'message': 'Order could not be found'}), 404
        return jsonify({
            "order": order_service.serialize_order(order)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Order could not be fetched: {str(e)}'}), 500

@order_blueprint.route('/', methods=['POST'])
def create_order():
    verify_jwt_in_request(optional=True)
    jwt_identity = get_jwt_identity()
    user_id = int(jwt_identity) if jwt_identity is not None else None
    session_id = request.cookies.get('cart_session')
    data = request.get_json()
    try:
        result = order_service.create_order_from_cart(data, user_id, session_id)
        if not result or not result.get("success"):
            return jsonify({
                'message': result.get('error', 'Order could not be created.')
            }), 500
        order = result.get("order")
        payment = result.get("payment")
        checkout_url = result.get("checkout_url")
        payment_session_id = result.get("payment_session_id")
        response = {
            'message': 'Order was created successfully.',
            'order': order_service.serialize_order(order),
        }
        if payment:
            response['payment'] = payment_service.serialize_payment(payment)
        if checkout_url:
            response['checkout_url'] = checkout_url
        if payment_session_id:
            response['payment_session_id'] = payment_session_id
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'message': f'Order Creation Failed: {str(e)}'}), 500

@order_blueprint.route('/<int:order_id>/cancel', methods=['POST'])
@auth_required
def cancel_order(order_id):
    user_id = int(get_jwt_identity())
    user = user_service.get_user_by_id(user_id)
    try:
        order = order_service.get_order_by_id(order_id)
        if not order:
            return jsonify({'message': 'Order could not be found.'}), 404
        if order.user_id != user_id and not user.is_admin:
            return jsonify({'message': 'Unauthorized Access'}), 403
        order = order_service.cancel_order(order)
        if not order:
            return jsonify({'message': f'Order cannot be cancelled since it has already been processed.'}), 409
        if user.is_admin:
            pass # TO DO: Notify buyers when admin cancels their order.
        return jsonify({
            'order': order_service.serialize_order(order),
            'message': 'Order was cancelled successfully.'
        }), 200
    except Exception as e:
        return jsonify({'message': f'Order Cancellation Failed: {str(e)}'}), 500

@order_blueprint.route('/admin/<int:order_id>', methods=['PUT'])
@admin_required
def update_order(order_id):
    data = request.get_json()
    try:
        updated_order = order_service.update_order(
            order_id = order_id,
            payment_id = data.get('payment_id'),
            status = data.get('status'),
            tracking_number = data.get('tracking_number')
        )
        if not updated_order:
            return jsonify({'message': f'Order could not be updated.'}), 500  
        return jsonify({
            'message': 'Order was updated successfully.',
            'order': order_service.serialize_order(updated_order),
        }), 200      
    except Exception as e:
        return jsonify({'message': f'Order Update Failed: {str(e)}'}), 500  