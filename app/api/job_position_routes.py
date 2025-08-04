from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, JobPosition

job_position_routes = Blueprint('job_positions', __name__)

@job_position_routes.route('', methods=['GET'])
@login_required
def get_all_positions():
    jobs = JobPosition.query.filter_by(user_id=current_user.id).order_by(JobPosition.created_at.desc()).all()
    return jsonify([job.to_dict() for job in jobs]), 200

@job_position_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_position(id):
    job = JobPosition.query.get(id)
    if not job or job.user_id != current_user.id:
        return jsonify({"error": "Not found or unauthorized"}), 404
    return jsonify(job.to_dict()), 200

@job_position_routes.route('', methods=['POST'])
@login_required
def create_position():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({"error": "Title is required"}), 400

    new_job = JobPosition(
        user_id=current_user.id,
        title=title,
        description=description
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 201

@job_position_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_position(id):
    job = JobPosition.query.get(id)
    if not job or job.user_id != current_user.id:
        return jsonify({"error": "Not found or unauthorized"}), 404

    data = request.get_json()
    job.title = data.get('title', job.title)
    job.description = data.get('description', job.description)

    db.session.commit()
    return jsonify(job.to_dict()), 200

@job_position_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_position(id):
    job = JobPosition.query.get(id)
    if not job or job.user_id != current_user.id:
        return jsonify({"error": "Not found or unauthorized"}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job position deleted"}), 200
