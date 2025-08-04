from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class UserSubscription(db.Model):
    __tablename__ = 'user_subscriptions'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False, unique=True)
    plan_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subscription_plans.id")), nullable=False)
    start_date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    end_date = db.Column(db.DateTime(timezone=True))
    trial_end_date = db.Column(db.DateTime(timezone=True))
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    auto_renew = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = db.relationship("User", back_populates="subscriptions")
    plan = db.relationship("SubscriptionPlan", back_populates="user_subscriptions")
    payment_records = db.relationship("PaymentRecord", back_populates="subscription", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plan_id": self.plan_id,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "trial_end_date": self.trial_end_date,
            "is_active": self.is_active,
            "auto_renew": self.auto_renew,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }