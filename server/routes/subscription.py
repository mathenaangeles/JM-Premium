from flask import Blueprint, request, jsonify

from middlewares.user import admin_required
from services.subscription import SubscriptionService

subscription_blueprint = Blueprint('subscription', __name__, url_prefix='/subscriptions')
subscription_service = SubscriptionService()

@subscription_blueprint.route('/', methods=['GET'])
@admin_required
def get_subscriptions():
    try:
        subscriptions = subscription_service.get_all_subscriptions()
        return jsonify({
            'subscriptions': [subscription_service.serialize_subscription(subscription) for subscription in subscriptions],
        }), 200
    except Exception as e:
        print(e)
        return jsonify({'message': f'Subscriptions Fetch Failed: {str(e)}'}), 500
    
@subscription_blueprint.route('/<string:email>', methods=['GET'])
def get_subscription(email):
    try:
        subscription = subscription_service.get_subscription_by_email(email)
        if not subscription:
            return jsonify({'message': 'Subscription could not be found.'}), 404
        return jsonify({
            "subscription": subscription_service.serialize_subscription(subscription)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Subscription Fetch Failed: {str(e)}'}), 500

@subscription_blueprint.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        subscription = subscription_service.subscribe(email)
        if not subscription:
            return jsonify({'message': f'Could not subscribe to newsletter.'}), 500
        return jsonify({
            'message': 'Subscribed to newsletter successfully.',
            'subscription': subscription_service.serialize_subscription(subscription)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Subscription Failed: {str(e)}'}), 500

@subscription_blueprint.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        subscription = subscription_service.unsubscribe(email)
        if not subscription:
            return jsonify({'message': 'Could not unsubscribe to newsletter.'}), 500
        return jsonify({
            'message': 'Unsubscribed to newsletter successfully.',
            'subscription': subscription_service.serialize_subscription(subscription)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Subscription Removal Failed: {str(e)}'}), 500