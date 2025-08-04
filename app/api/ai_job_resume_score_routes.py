from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Resume, JobPosition, ResumeJobScore
from .ai_resume_utils import extract_resume_text, call_ai_resume_job_match

job_resume_score_routes = Blueprint('job_resume_score', __name__)

@job_resume_score_routes.route('/jobs/<int:job_id>/resumes/<int:resume_id>/match', methods=['POST'])
@login_required
def match_resume_to_job(job_id, resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or unauthorized"}), 404

    job = JobPosition.query.get(job_id)
    if not job or job.user_id != current_user.id:
        return jsonify({"error": "Job not found or unauthorized"}), 404

    existing_score = ResumeJobScore.query.filter_by(
        resume_id=resume_id,
        job_id=job_id,
        ai_model="gpt-4"
    ).first()

    if existing_score:
        return jsonify({
            "resume_id": resume_id,
            "job_id": job_id,
            "match_score": existing_score.match_score,
            "score_skills": existing_score.score_skills,
            "score_experience": existing_score.score_experience,
            "summary": existing_score.summary,
            "cached": True
        }), 200

    try:
        resume_text = extract_resume_text(resume.file_url)
    except Exception as e:
        return jsonify({"error": f"Failed to extract resume text: {str(e)}"}), 400

    if not resume_text.strip():
        return jsonify({"error": "No text extracted from resume"}), 400

    try:
        match_data = call_ai_resume_job_match(resume_text, job.title, job.description)
    except Exception as e:
        return jsonify({"error": f"AI matching failed: {str(e)}"}), 500

    match_score = float(match_data.get("match_score", 0))
    score_skills = float(match_data.get("score_skills", 0))
    score_experience = float(match_data.get("score_experience", 0))
    summary = match_data.get("summary", "")

    new_score = ResumeJobScore(
        resume_id=resume_id,
        job_id=job_id,
        ai_model="gpt-4",
        match_score=match_score,
        score_skills=score_skills,
        score_experience=score_experience,
        summary=summary,
        evaluated_at=db.func.now()
    )
    db.session.add(new_score)
    db.session.commit()

    return jsonify({
        "resume_id": resume_id,
        "job_id": job_id,
        "match_score": match_score,
        "score_skills": score_skills,
        "score_experience": score_experience,
        "summary": summary,
        "cached": False
    }), 200


@job_resume_score_routes.route('/jobs/<int:job_id>/resumes/match_batch', methods=['POST'])
@login_required
def batch_match_resumes_to_job(job_id):
    job = JobPosition.query.get(job_id)
    if not job or job.user_id != current_user.id:
        return jsonify({"error": "Job not found or unauthorized"}), 404

    data = request.get_json()
    resume_ids = data.get("resume_ids", [])
    if not isinstance(resume_ids, list) or len(resume_ids) == 0:
        return jsonify({"error": "resume_ids must be a non-empty list"}), 400

    results = []

    for resume_id in resume_ids:
        resume = Resume.query.get(resume_id)
        if not resume or resume.user_id != current_user.id:
            results.append({
                "resume_id": resume_id,
                "error": "Resume not found or unauthorized"
            })
            continue

        existing_score = ResumeJobScore.query.filter_by(
            resume_id=resume_id,
            job_id=job_id,
            ai_model="gpt-4"
        ).first()

        if existing_score:
            results.append({
                "resume_id": resume_id,
                "job_id": job_id,
                "match_score": existing_score.match_score,
                "score_skills": existing_score.score_skills,
                "score_experience": existing_score.score_experience,
                "summary": existing_score.summary,
                "cached": True
            })
            continue

        try:
            resume_text = extract_resume_text(resume.file_url)
            if not resume_text.strip():
                results.append({
                    "resume_id": resume_id,
                    "error": "No text extracted from resume"
                })
                continue
        except Exception as e:
            results.append({
                "resume_id": resume_id,
                "error": f"Failed to extract resume text: {str(e)}"
            })
            continue

        try:
            match_data = call_ai_resume_job_match(resume_text, job.title, job.description)
        except Exception as e:
            results.append({
                "resume_id": resume_id,
                "error": f"AI matching failed: {str(e)}"
            })
            continue

        match_score = float(match_data.get("match_score", 0))
        score_skills = float(match_data.get("score_skills", 0))
        score_experience = float(match_data.get("score_experience", 0))
        summary = match_data.get("summary", "")

        new_score = ResumeJobScore(
            resume_id=resume_id,
            job_id=job_id,
            ai_model="gpt-4",
            match_score=match_score,
            score_skills=score_skills,
            score_experience=score_experience,
            summary=summary,
            evaluated_at=db.func.now()
        )
        db.session.add(new_score)

        results.append({
            "resume_id": resume_id,
            "job_id": job_id,
            "match_score": match_score,
            "score_skills": score_skills,
            "score_experience": score_experience,
            "summary": summary,
            "cached": False
        })

    db.session.commit()

    return jsonify({"results": results}), 200



