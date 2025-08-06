
from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, UserSubscription, SubscriptionPlan

subscriptions_bp = Blueprint('subscriptions', __name__)


@subscriptions_bp.route('/me', methods=['GET'])
@login_required
def get_my_subscription():
    subscription = UserSubscription.query.filter_by(user_id=current_user.id).first()

    if not subscription:
        return jsonify({'message': 'No active subscription found'}), 404

    plan = SubscriptionPlan.query.get(subscription.plan_id)

    return jsonify({
        'id': subscription.id,
        'user_id': subscription.user_id,
        'plan_id': subscription.plan_id,
        'start_date': subscription.start_date.isoformat() if subscription.start_date else None,
        'end_date': subscription.end_date.isoformat() if subscription.end_date else None,
        'trial_end_date': subscription.trial_end_date.isoformat() if subscription.trial_end_date else None,
        'is_active': subscription.is_active,
        'auto_renew': subscription.auto_renew,
        'plan': plan.to_dict() if plan else None
    }), 200

