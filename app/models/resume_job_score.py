from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class ResumeJobScore(db.Model):
    __tablename__ = 'resume_job_scores'
    if environment == "production":
        __table_args__ = (
            {'schema': SCHEMA},
            db.UniqueConstraint(
                'resume_id', 'job_id', 'ai_model',
                name='resume_job_model_unique'
            ),
        )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    resume_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("resumes.id")), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("job_positions.id")), nullable=False)
    ai_model = db.Column(db.String(100))
    match_score = db.Column(db.Float)
    score_skills = db.Column(db.Float)
    score_experience = db.Column(db.Float)
    summary = db.Column(db.Text)
    evaluated_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    resume = db.relationship("Resume", back_populates="resume_job_scores")
    job_position = db.relationship("JobPosition", back_populates="resume_job_scores")

    def to_dict(self):
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "job_id": self.job_id,
            "ai_model": self.ai_model,
            "match_score": self.match_score,
            "score_skills": self.score_skills,
            "score_experience": self.score_experience,
            "summary": self.summary,
            "evaluated_at": self.evaluated_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
