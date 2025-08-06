
from flask import Blueprint, jsonify, request
import os
import stripe
import json
from datetime import datetime, timedelta
from flask_login import current_user, login_required
from app.models import db, UserSubscription, SubscriptionPlan, PaymentRecord

stripe_routes = Blueprint('stripe', __name__)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
stripe.api_version = '2020-08-27'

@stripe_routes.route('/config', methods=['GET'])
@login_required
def get_publishable_key():
    plan_id = request.args.get('plan_id')
    plan = SubscriptionPlan.query.get_or_404(plan_id)

    return jsonify({
        'publicKey': os.getenv('STRIPE_PUBLISHABLE_KEY'),
        'plan': plan.to_dict(),
    })

@stripe_routes.route('/create-checkout-session/<int:plan_id>', methods=['POST'])
@login_required
def create_checkout_session(plan_id):
    plan = SubscriptionPlan.query.get_or_404(plan_id)
    domain_url = os.getenv('DOMAIN')

    try:
        session = stripe.checkout.Session.create(
            success_url=domain_url + '/payment/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=domain_url + '/payment/cancel',
            mode='subscription',
            payment_method_types=['card'],
            customer_email=current_user.email,
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': plan.name,
                        'description': plan.description,
                    },
                    'unit_amount': int(float(plan.price) * 100),
                    'recurring': {
                        'interval': plan.billing_cycle,
                    },
                },
                'quantity': 1,
            }],
            metadata={
                'user_id': current_user.id,
                'plan_id': plan.id
            }
        )
        return jsonify({'url': session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@stripe_routes.route('/checkout-session', methods=['GET'])
@login_required
def get_checkout_session():
    session_id = request.args.get('sessionId')
    session = stripe.checkout.Session.retrieve(session_id)
    return jsonify(session)

@stripe_routes.route('/webhook', methods=['POST'])
def stripe_webhook():
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    payload = request.data
    event = None

    if webhook_secret:
        sig_header = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except Exception as e:
            return str(e), 400
    else:
        event = json.loads(payload)

    event_type = event['type']
    data = event['data']['object']

    if event_type == 'checkout.session.completed':
        user_id = int(data['metadata']['user_id'])
        plan_id = int(data['metadata']['plan_id'])
        amount = data['amount_total'] / 100
        transaction_id = data['id']
        now = datetime.utcnow()
        next_month = now + timedelta(days=30)

        subscription = UserSubscription.query.filter_by(user_id=user_id).first()
        if subscription:
            subscription.plan_id = plan_id
            subscription.start_date = now
            subscription.end_date = next_month
            subscription.is_active = True
        else:
            subscription = UserSubscription(
                user_id=user_id,
                plan_id=plan_id,
                start_date=now,
                end_date=next_month,
                is_active=True,
                auto_renew=True
            )
            db.session.add(subscription)

        payment = PaymentRecord(
            user_id=user_id,
            subscription=subscription,
            amount=amount,
            currency='USD',
            payment_method='stripe',
            payment_date=now,
            status='completed',
            transaction_id=transaction_id
        )
        db.session.add(payment)
        db.session.commit()

        print('✅ Payment succeeded and database updated.')

    return jsonify({'status': 'success'}), 200

