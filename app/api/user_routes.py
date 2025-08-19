from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User

user_routes = Blueprint('users', __name__)

@user_routes.route('/', methods=['GET'])
@login_required
def get_users():
    users = User.query.all()
    return jsonify({'users': [user.to_dict() for user in users]}), 200

@user_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict()), 200

@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_user(id):
    user = User.query.get_or_404(id)
    if current_user.id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username and username != user.username:
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already in use'}), 400
        user.username = username

    if email and email != user.email:
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already in use'}), 400
        user.email = email

    if password:
        user.password = password  # 触发setter，自动hash

    db.session.commit()

    return jsonify(user.to_dict()), 200

@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    user = User.query.get_or_404(id)
    if current_user.id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

