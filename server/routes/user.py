from sqlalchemy.exc import IntegrityError
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, jwt_required

from services.user import UserService
from middlewares.user import auth_required, admin_required

user_blueprint = Blueprint('user', __name__, url_prefix='/users')
user_service = UserService()

@user_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = user_service.create_user(
            email=data.get('email'),
            password=data.get('password'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            country_code=data.get('country_code'),
            phone_number=data.get('phone_number')
        )
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        response = jsonify({
            'message': 'User was registered successfully.',
            'user': user_service.serialize_user(user),
        })
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response, 201
    except IntegrityError:
        return jsonify({'message': 'Email is already registered to an existing user.'}), 409
    except Exception as e:
        return jsonify({'message': f'Registration Failed: {str(e)}'}), 500
    
@user_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = user_service.get_user_by_email(data['email'])
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'The email address or password is invalid.'}), 401
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'is_admin': user.is_admin}
    )
    refresh_token = create_refresh_token(identity=str(user.id))
    response = jsonify({
        'message': 'User was logged in successfully.',
        'user': user_service.serialize_user(user),
    })
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200

@user_blueprint.route('/refresh', methods=['POST'])
@auth_required
def refresh():
    user_id = int(get_jwt_identity())
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'User could not be found.'}), 404
    access_token = create_access_token(
        identity=str(user_id),
        additional_claims={'is_admin': user.is_admin}
    )
    response = jsonify({
        'message': 'Access token refreshed successfully.'
    })
    set_access_cookies(response, access_token)
    return response, 200

@user_blueprint.route('/profile', methods=['GET', 'PUT'])
@auth_required
def profile():
    user_id = int(get_jwt_identity())
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'User could not be found.'}), 404
    if request.method=='GET':
        return jsonify({
            'user': user_service.serialize_user(user)
        }), 200
    elif request.method=='PUT':
        if user_id != user.id:
            return jsonify({'message': 'User is not authorized to perform this action.'}), 403
        try:
            data = request.get_json()
            updated_user = user_service.update_user(user_id, data)
            return jsonify({
                'message': 'Profile was updated successfully.',
                'user': user_service.serialize_user(updated_user)
            }), 200
        except Exception as e:
            return jsonify({'message': f'Profile Update Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405

@user_blueprint.route('/change-password', methods=['POST'])
@auth_required
def change_password():
    user_id = int(get_jwt_identity())
    user = user_service.get_user_by_id(user_id)
    if user_id != user.id:
        return jsonify({'message': 'User is not authorized to perform this action.'}), 403
    data = request.get_json()
    if not user:
        return jsonify({'message': 'User could not be found.'}), 404
    if not user.check_password(data['current_password']):
        return jsonify({'message': 'The current password is incorrect.'}), 401
    try:
        user_service.update_password(user_id, data['new_password'])
        return jsonify({'message': 'Password was changed successfully.'}), 200
    except Exception as e:
        return jsonify({'message': f'Password Change Failed: {str(e)}'}), 500
    
@user_blueprint.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'User logged out successfully.'})
    unset_jwt_cookies(response)
    return response, 200

@user_blueprint.route('/admin/all', methods=['GET'])
@admin_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', type=str)
    is_admin = request.args.get('is_admin', type=bool)
    filters = {}
    if is_admin is not None:
        filters['is_admin'] = is_admin
    try:
        users, count, total_pages = user_service.get_all_users(page, per_page, filters, search)
        return jsonify({
            'users': [user_service.serialize_user(user) for user in users],
            'count': count,
            'total_pages': total_pages,
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Users Fetch Failed: {str(e)}'}), 500

@user_blueprint.route('/admin/<int:user_id>', methods=['PUT', 'DELETE'])
@admin_required
def manage_user(user_id):
    if request.method=='PUT':
        data = request.get_json()
        is_admin = data.get('is_admin')
        try:
            updated_user = user_service.update_is_admin(user_id, is_admin)
            return jsonify({
                'message': 'User was updated successfully.',
                'user': user_service.serialize_user(updated_user)
            }), 200
        except Exception as e:
            return jsonify({'message': f'User Update Failed: {str(e)}'}), 500
    elif request.method=='DELETE':
        try:
            user_service.delete_user(user_id)
            return jsonify({
                'id': user_id,
                'message': 'User was deleted successfully.'
            }), 200
        except Exception as e:
            return jsonify({'message': f'User Deletion Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405