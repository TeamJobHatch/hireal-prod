from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, Resume, ResumeAnalysis
from .ai_resume_utils import extract_resume_text, call_ai_resume_analysis

ai_resume_analysis_routes = Blueprint('ai_resume_analysis', __name__)

@ai_resume_analysis_routes.route('/resumes/<int:resume_id>/analyze', methods=['POST'])
@login_required
def analyze_resume(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or unauthorized"}), 404

    # Check if there is existing analysis in the database
    existing_analysis = ResumeAnalysis.query.filter_by(
        resume_id=resume_id,
        ai_model="gpt-4"
    ).order_by(ResumeAnalysis.evaluated_at.desc()).first()

    if existing_analysis:
        # Return existing analysis without calling AI again
        return jsonify({"analysis": existing_analysis.to_dict()}), 200

    # If no existing analysis, extract resume text and call AI
    try:
        text = extract_resume_text(resume.file_url)
    except Exception as e:
        return jsonify({"error": f"Failed to extract resume text: {str(e)}"}), 400

    if not text.strip():
        return jsonify({"error": "No text extracted from resume"}), 400

    try:
        analysis_data = call_ai_resume_analysis(text)
    except Exception as e:
        return jsonify({"error": f"AI analysis failed: {str(e)}"}), 500

    # Save new analysis to the database
    new_analysis = ResumeAnalysis(
        resume_id=resume.id,
        ai_model="gpt-4",
        score_overall=analysis_data.get("score_overall"),
        score_format=analysis_data.get("score_format"),
        score_skills=analysis_data.get("score_skills"),
        score_experience=analysis_data.get("score_experience"),
        red_flags=analysis_data.get("red_flags"),
        positive_indicators=analysis_data.get("positive_indicators"),
        strengths=analysis_data.get("strengths"),
        weaknesses=analysis_data.get("weaknesses"),
        suggestions=analysis_data.get("suggestions"),
        evaluated_at=db.func.now()
    )

    db.session.add(new_analysis)
    db.session.commit()

    return jsonify({"analysis": new_analysis.to_dict()}), 200

