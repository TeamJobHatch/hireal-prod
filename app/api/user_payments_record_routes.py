# from flask import Blueprint, jsonify, request
# import os
# import stripe
# import json
# from datetime import datetime, timedelta
# from flask_login import current_user, login_required
# from app.models import db, UserSubscription, SubscriptionPlan, PaymentRecord

# stripe_routes = Blueprint('stripe', __name__)

# stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
# stripe.api_version = '2020-08-27'


# @stripe_routes.route('/config', methods=['GET'])
# @login_required
# def get_publishable_key():
#     plan_id = request.args.get('plan_id')
#     plan = SubscriptionPlan.query.get_or_404(plan_id)

#     return jsonify({
#         'publicKey': os.getenv('STRIPE_PUBLISHABLE_KEY'),
#         'plan': plan.to_dict(),
#     })


# @stripe_routes.route('/create-checkout-session/<int:plan_id>', methods=['POST'])
# @login_required
# def create_checkout_session(plan_id):
#     plan = SubscriptionPlan.query.get_or_404(plan_id)
#     domain_url = os.getenv('DOMAIN')

#     try:
#         session = stripe.checkout.Session.create(
#             success_url=domain_url + '/payment/success?session_id={CHECKOUT_SESSION_ID}',
#             cancel_url=domain_url + '/payment/cancel',
#             mode='subscription',
#             payment_method_types=['card'],
#             customer_email=current_user.email,
#             line_items=[{
#                 'price_data': {
#                     'currency': 'usd',
#                     'product_data': {
#                         'name': plan.name,
#                         'description': plan.description,
#                     },
#                     'unit_amount': int(float(plan.price) * 100),
#                     'recurring': {
#                         'interval': plan.billing_cycle,
#                     },
#                 },
#                 'quantity': 1,
#             }],
#             metadata={
#                 'user_id': current_user.id,
#                 'plan_id': plan.id
#             }
#         )
#         return jsonify({'url': session.url})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400


# @stripe_routes.route('/checkout-session', methods=['GET'])
# @login_required
# def get_checkout_session():
#     session_id = request.args.get('sessionId')
#     session = stripe.checkout.Session.retrieve(session_id)
#     return jsonify(session)


# @stripe_routes.route('/webhook', methods=['POST'])
# def stripe_webhook():
#     webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
#     payload = request.data
#     event = None

#     if webhook_secret:
#         sig_header = request.headers.get('stripe-signature')
#         try:
#             event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
#         except Exception as e:
#             return str(e), 400
#     else:
#         event = json.loads(payload)

#     event_type = event['type']
#     data = event['data']['object']

#     if event_type == 'checkout.session.completed':
#         user_id = int(data['metadata']['user_id'])
#         plan_id = int(data['metadata']['plan_id'])
#         amount = data['amount_total'] / 100
#         transaction_id = data['id']
#         now = datetime.utcnow()

#         plan = SubscriptionPlan.query.get(plan_id)
#         if not plan:
#             return jsonify({'error': 'Plan not found'}), 400

#         if plan.billing_cycle == 'year':
#             end_date = now + timedelta(days=365)
#         else:
#             end_date = now + timedelta(days=30)

#         subscription = UserSubscription.query.filter_by(user_id=user_id).first()
#         if subscription:
#             subscription.plan_id = plan_id
#             subscription.start_date = now
#             subscription.end_date = end_date
#             subscription.is_active = True
#         else:
#             subscription = UserSubscription(
#                 user_id=user_id,
#                 plan_id=plan_id,
#                 start_date=now,
#                 end_date=end_date,
#                 is_active=True,
#                 auto_renew=True
#             )
#             db.session.add(subscription)

#         payment = PaymentRecord(
#             user_id=user_id,
#             subscription=subscription,
#             amount=amount,
#             currency='USD',
#             payment_method='stripe',
#             payment_date=now,
#             status='completed',
#             transaction_id=transaction_id
#         )
#         db.session.add(payment)
#         db.session.commit()

#         print('✅ First payment success, subscription created/updated.')

#     elif event_type == 'invoice.payment_succeeded':
#         invoice = data
#         subscription_id = invoice.get('subscription')
#         payment_intent_id = invoice.get('payment_intent')
#         amount_paid = invoice.get('amount_paid') / 100
#         billing_reason = invoice.get('billing_reason')
#         period_start_ts = invoice.get('period_start')
#         period_end_ts = invoice.get('period_end')

#         user_subscription = None
#         if subscription_id:
#             user_subscription = UserSubscription.query.filter_by(stripe_subscription_id=subscription_id).first()

#         if not user_subscription:
#             print(f'⚠️ Subscription {subscription_id} not found in DB, ignoring invoice event.')
#             return jsonify({'status': 'ignored'}), 200

#         if not user_subscription.auto_renew:
#             print(f'⚠️ User {user_subscription.user_id} auto_renew disabled, skipping subscription extension.')
#             return jsonify({'status': 'ignored'}), 200

#         now = datetime.utcnow()
#         start_date = datetime.utcfromtimestamp(period_start_ts)
#         end_date = datetime.utcfromtimestamp(period_end_ts)

#         user_subscription.start_date = start_date
#         user_subscription.end_date = end_date
#         user_subscription.is_active = True

#         payment = PaymentRecord(
#             user_id=user_subscription.user_id,
#             subscription=user_subscription,
#             amount=amount_paid,
#             currency='USD',
#             payment_method='stripe',
#             payment_date=now,
#             status='completed',
#             transaction_id=payment_intent_id
#         )
#         db.session.add(payment)
#         db.session.commit()

#         print(f'✅ Auto-renewal payment succeeded for user {user_subscription.user_id}.')

#     elif event_type == 'customer.subscription.deleted':
#         subscription_id = data.get('id')
#         user_subscription = UserSubscription.query.filter_by(stripe_subscription_id=subscription_id).first()
#         if user_subscription:
#             user_subscription.is_active = False
#             user_subscription.auto_renew = False
#             db.session.commit()
#             print(f'⚠️ Subscription {subscription_id} cancelled and marked inactive.')

#     return jsonify({'status': 'success'}), 200


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

        # Retrieve full session to get subscription id
        session = stripe.checkout.Session.retrieve(transaction_id)
        stripe_subscription_id = session.get('subscription')

        plan = SubscriptionPlan.query.get(plan_id)
        if not plan:
            return jsonify({'error': 'Plan not found'}), 400

        if plan.billing_cycle == 'year':
            end_date = now + timedelta(days=365)
        else:
            end_date = now + timedelta(days=30)

        subscription = UserSubscription.query.filter_by(user_id=user_id).first()
        if subscription:
            subscription.plan_id = plan_id
            subscription.start_date = now
            subscription.end_date = end_date
            subscription.is_active = True
            subscription.stripe_subscription_id = stripe_subscription_id
        else:
            subscription = UserSubscription(
                user_id=user_id,
                plan_id=plan_id,
                start_date=now,
                end_date=end_date,
                is_active=True,
                auto_renew=True,
                stripe_subscription_id=stripe_subscription_id
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

        print('✅ First payment success, subscription created/updated.')

    elif event_type == 'invoice.payment_succeeded':
        invoice = data
        subscription_id = invoice.get('subscription')
        payment_intent_id = invoice.get('payment_intent')
        amount_paid = invoice.get('amount_paid') / 100
        billing_reason = invoice.get('billing_reason')
        period_start_ts = invoice.get('period_start')
        period_end_ts = invoice.get('period_end')

        user_subscription = None
        if subscription_id:
            user_subscription = UserSubscription.query.filter_by(stripe_subscription_id=subscription_id).first()

        if not user_subscription:
            print(f'⚠️ Subscription {subscription_id} not found in DB, ignoring invoice event.')
            return jsonify({'status': 'ignored'}), 200

        if not user_subscription.auto_renew:
            print(f'⚠️ User {user_subscription.user_id} auto_renew disabled, skipping subscription extension.')
            return jsonify({'status': 'ignored'}), 200

        now = datetime.utcnow()
        start_date = datetime.utcfromtimestamp(period_start_ts)
        end_date = datetime.utcfromtimestamp(period_end_ts)

        user_subscription.start_date = start_date
        user_subscription.end_date = end_date
        user_subscription.is_active = True

        payment = PaymentRecord(
            user_id=user_subscription.user_id,
            subscription=user_subscription,
            amount=amount_paid,
            currency='USD',
            payment_method='stripe',
            payment_date=now,
            status='completed',
            transaction_id=payment_intent_id
        )
        db.session.add(payment)
        db.session.commit()

        print(f'✅ Auto-renewal payment succeeded for user {user_subscription.user_id}.')

    elif event_type == 'customer.subscription.deleted':
        subscription_id = data.get('id')
        user_subscription = UserSubscription.query.filter_by(stripe_subscription_id=subscription_id).first()
        if user_subscription:
            user_subscription.is_active = False
            user_subscription.auto_renew = False
            db.session.commit()
            print(f'⚠️ Subscription {subscription_id} cancelled and marked inactive.')

    return jsonify({'status': 'success'}), 200
