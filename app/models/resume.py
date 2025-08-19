from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Resume(db.Model):
    __tablename__ = 'resumes'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    file_name = db.Column(db.Text)
    file_url = db.Column(db.Text)
    uploaded_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = db.relationship("User", back_populates="resumes")
    resume_analyses = db.relationship("ResumeAnalysis", back_populates="resume", cascade="all, delete-orphan")
    resume_job_scores = db.relationship("ResumeJobScore", back_populates="resume", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "file_name": self.file_name,
            "file_url": self.file_url,
            "uploaded_at": self.uploaded_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }