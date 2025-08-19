
from flask import Blueprint, request, jsonify, abort
from flask_login import login_required
from app.models import db, SubscriptionPlan
from .admin_helper import admin_required

plans_bp = Blueprint('plans', __name__)

@plans_bp.route('/', methods=['GET'])
def get_all_plans():
    plans = SubscriptionPlan.query.all()
    return jsonify([plan.to_dict() for plan in plans])

@plans_bp.route('/', methods=['POST'])
@login_required
@admin_required
def create_plan():
    data = request.get_json()
    try:
        plan = SubscriptionPlan(
            name=data['name'],
            tagline=data.get('tagline'),
            description=data.get('description'),
            price=data['price'],
            billing_cycle=data['billing_cycle'],
            feature_flags=data.get('feature_flags')
        )
        db.session.add(plan)
        db.session.commit()
        return jsonify(plan.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@plans_bp.route('/<int:plan_id>', methods=['PUT'])
@login_required
@admin_required
def update_plan(plan_id):
    data = request.get_json()
    plan = SubscriptionPlan.query.get_or_404(plan_id)

    try:
        plan.name = data.get('name', plan.name)
        plan.tagline = data.get('tagline', plan.tagline)
        plan.description = data.get('description', plan.description)
        plan.price = data.get('price', plan.price)
        plan.billing_cycle = data.get('billing_cycle', plan.billing_cycle)
        plan.feature_flags = data.get('feature_flags', plan.feature_flags)
        db.session.commit()
        return jsonify(plan.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@plans_bp.route('/<int:plan_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_plan(plan_id):
    plan = SubscriptionPlan.query.get_or_404(plan_id)
    db.session.delete(plan)
    db.session.commit()
    return jsonify({'message': 'Plan deleted'}), 200
