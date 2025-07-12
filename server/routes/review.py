from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

from services.user import UserService
from services.review import ReviewService
from middlewares.user import auth_required, admin_required

review_blueprint = Blueprint('review', __name__, url_prefix='/reviews')
review_service = ReviewService()
user_service = UserService()

@review_blueprint.route('/', methods=['GET'])
def get_reviews():
    product_id = request.args.get('product_id', type=int)
    user_id = request.args.get('user_id', type=int)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)  
    approved = request.args.get('approved', type=lambda v: v.lower() == 'true' if v else None)
    verified = request.args.get('verified', type=lambda v: v.lower() == 'true' if v else None)  
    try:
        reviews, count, total_pages, rating_counts = review_service.get_reviews(
            product_id=product_id, 
            user_id=user_id,
            page=page, 
            per_page=per_page,
            approved=approved,
            verified=verified)
        return jsonify({
            'reviews': [review_service.serialize_review(review) for review in reviews],
            'count': count,
            'total_pages': total_pages,
            'page': page,
            'per_page': per_page,
            'rating_counts': rating_counts,
        }), 200
    except Exception as e:
        print(e)
        return jsonify({'message': f'Reviews Fetch Failed: {str(e)}'}), 500
    
@review_blueprint.route('/<int:review_id>', methods=['GET'])
def get_review(review_id):
    try:
        review = review_service.get_review_by_id(review_id)
        if not review:
            return jsonify({'message': 'Review could not be found.'}), 404
        return jsonify({
            "review": review_service.serialize_review(review)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Review Fetch Failed: {str(e)}'}), 500

@review_blueprint.route('/product/<int:product_id>', methods=['POST'])
@auth_required
def create_review(product_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    try:
        review = review_service.create_review(user_id, product_id, data)
        if not review:
            return jsonify({'message': f'Review could not be created.'}), 500
        return jsonify({
            'message': 'Review was created successfully.',
            'review': review_service.serialize_review(review)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Review Creation Failed: {str(e)}'}), 500

@review_blueprint.route('/<int:review_id>', methods=['PUT', 'DELETE'])
@auth_required
def manage_review(review_id):
    user_id = int(get_jwt_identity())
    user = user_service.get_user_by_id(user_id)
    if request.method == 'PUT':
        data = request.get_json()
        try:
            updated_review = review_service.update_review(review_id, user_id, data)
            if not updated_review:
                return jsonify({'message': 'Review could not be updated.'}), 500
            return jsonify({
                'message': 'Review was updated successfully.',
                'review': review_service.serialize_review(updated_review)
            }), 200
        except Exception as e:
            return jsonify({'message': f'Review Update Failed: {str(e)}'}), 500
    elif request.method == 'DELETE':
        try:
            review = review_service.get_review_by_id(review_id)
            if not review:
                return jsonify({'message': 'Review could not be found.'}), 500
            if review.user_id != user_id and not user.id_admin:
                return jsonify({'message': 'Unauthorized Access'}), 403
            review_service.delete_review(review)
            return jsonify({
                'id': review_id,
                'message': 'Review was deleted successfully.'
            }), 200
        except Exception as e:
            return jsonify({'message': f'Review Deletion Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405