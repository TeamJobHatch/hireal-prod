from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class SubscriptionPlan(db.Model):
    __tablename__ = 'subscription_plans'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    tagline = db.Column(db.String(255))
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    billing_cycle = db.Column(db.String(50), nullable=False)
    feature_flags = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user_subscriptions = db.relationship("UserSubscription", back_populates="plan", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tagline": self.tagline,
            "description": self.description,
            "price": float(self.price),
            "billing_cycle": self.billing_cycle,
            "feature_flags": self.feature_flags,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }