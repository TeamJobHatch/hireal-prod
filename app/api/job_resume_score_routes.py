from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Resume, ResumeJobScore, ResumeAnalysis, JobPosition

resume_job_score_routes = Blueprint('resume_job_score', __name__)

@resume_job_score_routes.route('/scores', methods=['GET'])
@login_required
def get_all_scores():
    user_resume_ids = [r.id for r in Resume.query.filter_by(user_id=current_user.id).all()]

    scores = ResumeJobScore.query.filter(ResumeJobScore.resume_id.in_(user_resume_ids)).all()

    results = []
    for score in scores:
        score_dict = score.to_dict()
        analyses = ResumeAnalysis.query.filter_by(resume_id=score.resume_id).all()
        score_dict["resume_analyses"] = [a.to_dict() for a in analyses]
        results.append(score_dict)

    return jsonify({"scores": results}), 200


@resume_job_score_routes.route('/jobs/<int:job_id>/scores', methods=['GET'])
@login_required
def get_scores_by_job(job_id):
    user_resume_ids = [r.id for r in Resume.query.filter_by(user_id=current_user.id).all()]

    scores = ResumeJobScore.query.filter(
        ResumeJobScore.job_id == job_id,
        ResumeJobScore.resume_id.in_(user_resume_ids)
    ).all()

    results = []
    for score in scores:
        score_dict = score.to_dict()
        analyses = ResumeAnalysis.query.filter_by(resume_id=score.resume_id).all()
        score_dict["resume_analyses"] = [a.to_dict() for a in analyses]
        results.append(score_dict)

    return jsonify({"scores": results}), 200


@resume_job_score_routes.route('/resumes/scores', methods=['GET'])
@login_required
def get_scores_by_resumes():
    user_resume_ids = [r.id for r in Resume.query.filter_by(user_id=current_user.id).all()]

    scores = ResumeJobScore.query.filter(ResumeJobScore.resume_id.in_(user_resume_ids)).all()

    results = {}
    for resume_id in user_resume_ids:
        resume_scores = [s.to_dict() for s in scores if s.resume_id == resume_id]
        results[resume_id] = resume_scores

    return jsonify({"resume_scores": results}), 200


@resume_job_score_routes.route('/jobs/<int:job_id>/resumes/<int:resume_id>/scores', methods=['GET'])
@login_required
def get_score_by_job_and_resume(job_id, resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or unauthorized"}), 404

    scores = ResumeJobScore.query.filter_by(job_id=job_id, resume_id=resume_id).all()

    results = []
    for score in scores:
        score_dict = score.to_dict()
        analyses = ResumeAnalysis.query.filter_by(resume_id=resume_id).all()
        score_dict["resume_analyses"] = [a.to_dict() for a in analyses]
        results.append(score_dict)

    return jsonify({"scores": results}), 200


@resume_job_score_routes.route('/user/jobs-with-matches', methods=['GET'])
@login_required
def get_jobs_with_matches():
    user_resume_ids = [r.id for r in Resume.query.filter_by(user_id=current_user.id).all()]
    user_jobs = JobPosition.query.filter_by(user_id=current_user.id).all()

    results = []
    for job in user_jobs:
        scores = ResumeJobScore.query.filter(
            ResumeJobScore.job_id == job.id,
            ResumeJobScore.resume_id.in_(user_resume_ids)
        ).all()

        matched_resumes = []
        for score in scores:
            score_dict = score.to_dict()
            analyses = ResumeAnalysis.query.filter_by(resume_id=score.resume_id).all()
            score_dict["resume_analyses"] = [a.to_dict() for a in analyses]
            matched_resumes.append(score_dict)

        results.append({
            "job_id": job.id,
            "job_title": job.title,
            "matched_resumes": matched_resumes
        })

    return jsonify({"jobs": results}), 200

