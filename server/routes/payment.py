from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from services.user import UserService
from services.payment import PaymentService
from middlewares.user import admin_required, auth_required

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

@payment_blueprint.route('/create-payment-request', methods=['POST'])
def create_payment_request():
    try:
        verify_jwt_in_request(optional=True)
        jwt_identity = get_jwt_identity()
    except Exception:
        jwt_identity = None
    user_id = int(jwt_identity) if jwt_identity is not None else None
    data = request.get_json()
    try:
        result = payment_service.create_payment_request(
            user_id=user_id,
            amount=data.get('amount'),
            currency=data.get('currency', 'PHP'),
            description=data.get('description', 'Order Payment'),
            payment_method=data.get('payment_method'),
            order_id=data.get('order_id'),
            card_number=data.get('card_number'),
            expiry_year=data.get('expiry_year'),
            expiry_month=data.get('expiry_month'),
            cvn=data.get('cvn'),
            cardholder_first_name=data.get('cardholder_first_name'),
            cardholder_last_name=data.get('cardholder_last_name'),
            cardholder_email=data.get('cardholder_email'),
            skip_three_ds=data.get('skip_three_ds'),
            ewallet_type=data.get('ewallet_type')
        )
        if not result.get("success"):
            return jsonify({'message': result.get('error', 'Payment request could not be created.')}), 500
        response_data = {
            'message': 'Payment request created successfully.',
            'payment': payment_service.serialize_payment(result.get("payment")),
            'actions': result.get("actions", []),
            'xendit_status': result.get("status")
        }
        return jsonify(response_data), 201
    except Exception as e:
        return jsonify({'message': f'Payment Request Creation Failed: {str(e)}'}), 500

@payment_blueprint.route('/webhook', methods=['POST'])
def payment_request_webhook():
    webhook_data = request.get_json()
    headers = dict(request.headers)
    if not webhook_data:
        return jsonify({'message': 'Invalid Webhook Data'}), 400
    try:
        result = payment_service.handle_payment_request_webhook(webhook_data, headers)
        status_code = result.pop('status_code', 200) if 'status_code' in result else 200
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({
            'message': f'Webhook Processing Failed: {str(e)}'
        }), 500

@payment_blueprint.route('/status/<int:payment_id>', methods=['GET'])
@auth_required
def check_payment_status(payment_id):
    verify_jwt_in_request()
    jwt_identity = get_jwt_identity()
    user_id = int(jwt_identity) if jwt_identity is not None else None
    user = user_service.get_user_by_id(user_id)
    try:
        payment = payment_service.get_payment_by_id(payment_id)
        if not payment:
            return jsonify({'message': 'Payment Not Found'}), 404
        if payment.user_id != user_id and not user.is_admin:
            return jsonify({'message': 'Access Denied'}), 403
        result = payment_service.check_payment_status(payment_id)
        if not result.get("success"):
            return jsonify({'message': result.get('error', 'Payment status could not be retrieved.')}), 500
        return jsonify({
            'message': 'Payment status retrieved successfully.',
            'payment': payment_service.serialize_payment(result.get("payment")),
            'xendit_status': result.get('xendit_status')
        }), 200
    except Exception as e:
        return jsonify({'message': f'Status Check Failed: {str(e)}'}), 500

@payment_blueprint.route('/my-payments', methods=['GET'])
@auth_required
def get_user_payments():
    verify_jwt_in_request()
    jwt_identity = get_jwt_identity()
    user_id = int(jwt_identity)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status', type=str)
    payment_method = request.args.get('payment_method', type=str)
    filters = {'user_id': user_id}
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