from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Resume
from .aws_helpers import upload_file_to_s3, remove_file_from_s3

resume_routes = Blueprint('resumes', __name__)

ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_RESUMES_PER_USER = 10
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def file_size_within_limit(file):
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    return size <= MAX_FILE_SIZE


@resume_routes.route('', methods=['GET'])
@login_required
def get_user_resumes():
    resumes = Resume.query.filter_by(user_id=current_user.id).order_by(Resume.uploaded_at.desc()).all()
    return jsonify({"resumes": [r.to_dict() for r in resumes]}), 200


@resume_routes.route('/<int:resume_id>', methods=['GET'])
@login_required
def get_resume_by_id(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or no permission"}), 404
    return jsonify({"resume": resume.to_dict()}), 200


@resume_routes.route('', methods=['POST'])
@login_required
def upload_resume():
    existing_count = Resume.query.filter_by(user_id=current_user.id).count()

    files = request.files.getlist('file')  # 获取所有叫 file 的文件列表
    if not files or len(files) == 0:
        return jsonify({"error": "No file uploaded"}), 400

    if existing_count + len(files) > MAX_RESUMES_PER_USER:
        return jsonify({"error": f"Limit exceeded: you can upload max {MAX_RESUMES_PER_USER} resumes total."}), 400

    new_resumes = []

    for file in files:
        print(f"Uploading file: filename={file.filename}, type={type(file)}, content_type={getattr(file, 'content_type', None)}")
        if file.filename == '':
            continue  # 跳过空文件名
        if not allowed_file(file.filename):
            return jsonify({"error": f"Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
        if not file_size_within_limit(file):
            return jsonify({"error": "File too large (max 10MB)"}), 400

        upload_result = upload_file_to_s3(file)
        if 'url' not in upload_result:
            return jsonify({"error": upload_result.get('errors', 'Upload failed')}), 500

        file_url = upload_result['url']
        file_name = file.filename

        new_resume = Resume(
            user_id=current_user.id,
            file_name=file_name,
            file_url=file_url,
        )
        db.session.add(new_resume)
        new_resumes.append(new_resume)

    db.session.commit()

    return jsonify({"message": "Resumes uploaded", "resumes": [r.to_dict() for r in new_resumes]}), 201



@resume_routes.route('/<int:resume_id>', methods=['PUT'])
@login_required
def update_resume(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or no permission"}), 404

    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file name"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": f"Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
        if not file_size_within_limit(file):
            return jsonify({"error": "File too large"}), 400

        remove_file_from_s3(resume.file_url)
        upload_result = upload_file_to_s3(file)
        if 'url' not in upload_result:
            return jsonify({"error": upload_result.get('errors', 'Upload failed')}), 500

        resume.file_url = upload_result['url']
        resume.file_name = file.filename
    else:
        file_name = request.form.get('file_name')
        if file_name:
            resume.file_name = file_name

    db.session.commit()
    return jsonify({"message": "Resume updated", "resume": resume.to_dict()}), 200


@resume_routes.route('/<int:resume_id>', methods=['DELETE'])
@login_required
def delete_resume(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != current_user.id:
        return jsonify({"error": "Resume not found or no permission"}), 404

    remove_file_from_s3(resume.file_url)
    db.session.delete(resume)
    db.session.commit()

    return jsonify({"message": "Resume deleted"}), 200
