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
    
@payment_blueprint.route('/create-invoice', methods=['POST'])
def create_invoice():
    try:
        verify_jwt_in_request(optional=True)
        jwt_identity = get_jwt_identity()
    except Exception:
        user_id = None
    user_id = int(jwt_identity) if jwt_identity is not None else None
    data = request.get_json()
    try:
        result = payment_service.create_xendit_invoice(
            user_id=user_id,
            amount=data.get('amount'),
            currency=data.get('currency', 'PHP'),
            description=data.get('description', 'Order Payment'),
            payment_methods=data.get('payment_methods'),
            customer_email=data.get('customer_email'),
            customer_name=data.get('customer_name')
        )
        print(result)
        if not result.get("success"):
            return jsonify({'message': 'Invoice could not be created.'}), 500
        return jsonify({
            'message': 'Invoice was created successfully.',
            'payment': payment_service.serialize_payment(result.get("payment"))
        }), 201
    except Exception as e:
        return jsonify({'message': f'Invoice Creation Failed: {str(e)}'}), 500
    
@payment_blueprint.route('/create-virtual-account', methods=['POST'])
def create_virtual_account():
    try:
        verify_jwt_in_request(optional=True)
        jwt_identity = get_jwt_identity()
    except Exception:
        user_id = None
    user_id = int(jwt_identity) if jwt_identity is not None else None
    data = request.get_json()
    try:
        result = payment_service.create_virtual_account_payment(
            user_id=user_id,
            amount=data.get('amount'),
            bank_code=data.get('bank_code', 'BDO'),
            currency=data.get('currency', 'PHP'),
            customer_name=data.get('customer_name')
        )
        if not result.get("success"):
            return jsonify({'message': 'Virtual account could not be created.'}), 500
        return jsonify({
            'message': 'Virtual account was created successfully.',
            'payment': payment_service.serialize_payment(result.get("payment")),
            'account_number': result.get("account_number"),
            'bank_code': result.get("bank_code"),
        }), 201
    except Exception as e:
        return jsonify({'message': f'Virtual Account Creation Failed: {str(e)}'}), 500
    
@payment_blueprint.route('/webhook', methods=['POST'])
def xendit_webhook():
    webhook_data = request.get_json()
    headers = dict(request.headers)
    if not webhook_data:
        return jsonify({'message': 'Invalid Webhook Data'}), 400
    try:
        result = payment_service.handle_xendit_webhook(webhook_data, headers)
        status_code = result.pop('status_code', 200) if 'status_code' in result else 200
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({
            'message': f'Webhook Processing Failed: {str(e)}'
        }), 500
    
@payment_blueprint.route('/status/<int:payment_id>', methods=['GET'])
@auth_required
def check_payment_status(payment_id):
    verify_jwt_in_request(optional=True)
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
            return jsonify({'message': 'Payment status could not be retrieved.'}), 500
        return jsonify({
            'message': 'Payment status was retrieved successfully.',
            'payment': payment_service.serialize_payment(payment)
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