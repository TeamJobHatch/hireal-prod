from functools import wraps
from flask import jsonify
from flask_login import current_user
from app.models import UserSubscription  

def membership_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'error': 'Authentication required'}), 401

        subscription = UserSubscription.query.filter_by(user_id=current_user.id).first()
        if not subscription or not subscription.is_active:
            return jsonify({'error': 'Active membership required'}), 403

        return f(*args, **kwargs)
    return decorated_function
