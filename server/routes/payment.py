from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from services.user import UserService
from services.payment import PaymentService
from middlewares.user import admin_required

payment_blueprint = Blueprint('payment', __name__, url_prefix='/payments')
payment_service = PaymentService()
user_service = UserService()

@payment_blueprint.route('/admin', methods=['GET'])
@admin_required
def get_payments():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    user_id = request.args.get('user_id', type=int)
    status = request.args.get('status', type=str)
    payment_method = request.args.get('payment_method', type=str)
    filters = {}
    if user_id is not None:
        filters['user_id'] = user_id
    if status is not None:
        filters['status'] = status
    if payment_method is not None:
        filters['payment_method'] = payment_method
    try:
        payments, count, total_pages = payment_service.get_payments(page, per_page, filters)
        return jsonify({
            'payments': [payment_service.serialize_payment(payment) for payment in payments],
            'count': count,
            'total_pages': total_pages,
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Payments Fetch Failed: {str(e)}'}), 500

@payment_blueprint.route('/<int:payment_id>', methods=['GET'])
@admin_required
def get_payment(payment_id):
    try:
        payment = payment_service.get_payment_by_id(payment_id)
        if not payment:
            return jsonify({'message': 'Payment could not be found.'}), 404
        return jsonify({
            "payment": payment_service.serialize_payment(payment)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Payment Fetch Failed: {str(e)}'}), 500

@payment_blueprint.route('/', methods=['POST'])
def create_payment():
    verify_jwt_in_request(optional=True)
    jwt_identity = get_jwt_identity()
    user_id = int(jwt_identity) if jwt_identity is not None else None
    data = request.get_json()
    try:
        payment = payment_service.process_payment(user_id, data)
        if not payment:
            return jsonify({'message': 'Payment could not be processed.'}), 500
        return jsonify({
            'message': 'Payment was processed successfully.',
            'payment': payment_service.serialize_payment(payment)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Payment Processing Failed: {str(e)}'}), 500