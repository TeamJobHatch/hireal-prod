from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Resume, ResumeAnalysis

resume_analysis_routes = Blueprint('ai_resume_analysis', __name__)

@resume_analysis_routes.route('/analyses', methods=['GET'])
@login_required
def get_all_resume_analyses():
    user_resume_ids = [r.id for r in Resume.query.filter_by(user_id=current_user.id).all()]

    analyses = ResumeAnalysis.query.filter(ResumeAnalysis.resume_id.in_(user_resume_ids)).all()

    return jsonify({"analyses": [a.to_dict() for a in analyses]}), 200


@resume_analysis_routes.route('/resumes/<int:resume_id>/analyses', methods=['GET'])
@login_required
def get_resume_analyses(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or unauthorized"}), 404

    analyses = ResumeAnalysis.query.filter_by(resume_id=resume_id).all()

    return jsonify({"analyses": [a.to_dict() for a in analyses]}), 200
