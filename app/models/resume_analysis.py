from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class ResumeAnalysis(db.Model):
    __tablename__ = 'resume_analyses'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    resume_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("resumes.id")), nullable=False)
    ai_model = db.Column(db.String(100))
    score_overall = db.Column(db.Float)
    score_format = db.Column(db.Float)
    score_skills = db.Column(db.Float)
    score_experience = db.Column(db.Float)
    red_flags = db.Column(db.Text)
    positive_indicators = db.Column(db.Text)
    strengths = db.Column(db.Text)
    weaknesses = db.Column(db.Text)
    suggestions = db.Column(db.Text)
    evaluated_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    resume = db.relationship("Resume", back_populates="resume_analyses")

    def to_dict(self):
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "ai_model": self.ai_model,
            "score_overall": self.score_overall,
            "score_format": self.score_format,
            "score_skills": self.score_skills,
            "score_experience": self.score_experience,
            "red_flags": self.red_flags,
            "positive_indicators": self.positive_indicators,
            "strengths": self.strengths,
            "weaknesses": self.weaknesses,
            "suggestions": self.suggestions,
            "evaluated_at": self.evaluated_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }