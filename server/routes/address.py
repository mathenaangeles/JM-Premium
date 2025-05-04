from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

from middlewares.user import auth_required
from services.address import AddressService

address_blueprint = Blueprint('address', __name__, url_prefix='/addresses')
address_service = AddressService()

@address_blueprint.route('/', methods=['GET'])
@auth_required
def get_user_addresses():
    user_id = int(get_jwt_identity())
    try:
        addresses = address_service.get_user_addresses(user_id)
        return jsonify([address_service.serialize_address(address) for address in addresses]), 200
    except Exception as e:
        return jsonify({'message': f'Addresses Fetch Failed: {str(e)}'}), 500

@address_blueprint.route('/', methods=['POST'])
@auth_required
def create_address():
    user_id = int(get_jwt_identity())
    try:
        data = request.get_json()
        address = address_service.create_address(data, user_id)
        return jsonify({
            'message': 'Address was created successfully.',
            'address': address_service.serialize_address(address)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Address Creation Failed: {str(e)}'}), 500


@address_blueprint.route('/<int:address_id>', methods=['PUT', 'DELETE'])
@auth_required
def manage_address(address_id):
    user_id = int(get_jwt_identity())
    address = address_service.get_address_by_id(address_id)
    if not address:
        return jsonify({'message': 'Address could not be found.'}), 404
    if address.user_id != user_id:
        return jsonify({'message': 'User is not authorized to perform this action.'}), 403
    if request.method == 'PUT':
        try:
            data = request.get_json()
            updated_address = address_service.update_address(address_id, data)
            return jsonify({
                'message': 'Address was updated successfully.',
                'address': address_service.serialize_address(updated_address)
            }), 200
        except Exception as e:
            return jsonify({'message': f'Address Update Failed: {str(e)}'}), 500
    elif request.method == 'DELETE':
        try:
            address_service.delete_address(address_id)
            return jsonify({
                'id': address_id,
                'message': 'Address was deleted successfully.'
            }), 200
        except Exception as e:
            return jsonify({'message': f'Address Deletion Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405
