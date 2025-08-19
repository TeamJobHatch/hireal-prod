from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class PaymentRecord(db.Model):
    __tablename__ = 'payment_records'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    subscription_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user_subscriptions.id")), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='USD')
    payment_method = db.Column(db.String(50))
    payment_date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    status = db.Column(db.String(50), default='completed')
    transaction_id = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = db.relationship("User", back_populates="payment_records")
    subscription = db.relationship("UserSubscription", back_populates="payment_records")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subscription_id": self.subscription_id,
            "amount": float(self.amount),
            "currency": self.currency,
            "payment_method": self.payment_method,
            "payment_date": self.payment_date,
            "status": self.status,
            "transaction_id": self.transaction_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }