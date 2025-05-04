import uuid
from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from services.cart import CartService

cart_blueprint = Blueprint('cart', __name__, url_prefix='/cart')
cart_service = CartService()

def get_cart_identifier():
    verify_jwt_in_request(optional=True)
    jwt_identity = get_jwt_identity()
    user_id = int(jwt_identity) if jwt_identity else None
    session_id = request.cookies.get('cart_session')
    new_session_created = False
    if not session_id:
        session_id = str(uuid.uuid4())
        new_session_created = True
    g.new_session_id = session_id if new_session_created else None
    return user_id, session_id

def get_response(cart):
    response = jsonify(cart_service.serialize_cart(cart))
    if getattr(g, 'new_session_id', None):
        response.set_cookie(
            'cart_session',
            g.new_session_id,
            max_age=60 * 60 * 24 * 30,
            httponly=True,
            samesite='Lax'
        )
    return response

@cart_blueprint.route('/', methods=['GET'])
def get_cart():
    user_id, session_id = get_cart_identifier()
    try:
        cart = cart_service.get_cart(user_id, session_id)
        return get_response(cart), 200
    except Exception as e:
        return jsonify({'message': f'Cart Fetch Failed: {str(e)}'}), 500

@cart_blueprint.route('/', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    variant_id = data.get('variant_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    try:
        user_id, session_id = get_cart_identifier()
        cart_service.add_to_cart(product_id, variant_id, quantity, user_id, session_id)
        cart = cart_service.get_cart(user_id, session_id)
        return get_response(cart), 200
    except Exception as e:
        return jsonify({'message': f'Cart Item Addition Failed: {str(e)}'}), 500

@cart_blueprint.route('/<int:cart_item_id>', methods=['PUT', 'DELETE'])
def update_cart_item(cart_item_id):
    user_id, session_id = get_cart_identifier()
    if request.method == 'PUT':
        data = request.get_json()
        quantity = data.get('quantity')
        try:
            cart_service.update_cart_item(cart_item_id, quantity, user_id, session_id)
        except Exception as e:
            return jsonify({'message': f'Cart Update Failed: {str(e)}'}), 500
    elif request.method == 'DELETE':
        try:
            cart_service.remove_from_cart(cart_item_id, user_id, session_id)
        except Exception as e:
            return jsonify({'message': f'Cart Item Deletion Failed: {str(e)}'}), 500
    cart = cart_service.get_cart(user_id, session_id)
    return get_response(cart), 200

@cart_blueprint.route('/clear', methods=['DELETE'])
def clear_cart():
    try:
        user_id, session_id = get_cart_identifier()
        cart_service.clear_cart(user_id, session_id)
        cart = cart_service.get_cart(user_id, session_id)
        return get_response(cart), 200
    except Exception as e:
        return jsonify({'message': f'Clearing Cart Failed: {str(e)}'}), 500