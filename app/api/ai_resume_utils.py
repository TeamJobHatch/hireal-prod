import re
import json
import boto3
import fitz  # PyMuPDF for PDF handling
from docx import Document
from io import BytesIO
from openai import OpenAI
import os

# Initialize OpenAI client
client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET'),
    region_name=os.getenv('S3_REGION', 'us-east-1')
)

def get_file_bytes_from_s3(s3_url):
    """
    Download file content from S3 URL and return bytes
    """
    match = re.match(r"https://(.+)\.s3\.amazonaws\.com/(.+)", s3_url)
    if not match:
        raise ValueError("Invalid S3 URL format")
    bucket_name, key = match.groups()
    obj = s3.get_object(Bucket=bucket_name, Key=key)
    return obj['Body'].read()

def extract_text_from_pdf_bytes(pdf_bytes, max_pages=3):
    """
    Extract text from PDF bytes, limited to max_pages pages
    """
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc[:max_pages]:
            text += page.get_text()
    return text

def extract_text_from_docx_bytes(docx_bytes):
    """
    Extract text from DOCX bytes
    """
    doc = Document(BytesIO(docx_bytes))
    paragraphs = [para.text for para in doc.paragraphs]
    return "\n".join(paragraphs)

def extract_resume_text(file_url):
    """
    Download and extract resume text from given file URL, supporting PDF and DOCX
    """
    file_bytes = get_file_bytes_from_s3(file_url)
    ext = file_url.rsplit('.', 1)[-1].lower()
    if ext == 'pdf':
        return extract_text_from_pdf_bytes(file_bytes)
    elif ext == 'docx':
        return extract_text_from_docx_bytes(file_bytes)
    else:
        raise ValueError(f"Unsupported file extension: {ext}")

def call_ai_resume_analysis(resume_text):
    """
    Call OpenAI GPT to analyze resume content, returning structured scores and suggestions as a dict
    """
    prompt = f"""
You are an expert HR professional and AI resume analyst.

Analyze the following resume text and provide a JSON response with fields:
- score_overall: float 0-10
- score_format: float 0-10
- score_skills: float 0-10
- score_experience: float 0-10
- red_flags: text with possible issues (e.g. AI-generated content)
- positive_indicators: text with good signals
- strengths: summary of candidate strengths
- weaknesses: summary of candidate weaknesses
- suggestions: concrete improvement suggestions

Respond ONLY with valid JSON.

Resume text:
{resume_text}
"""
    if not client:
        return {
            "score_overall": 0.7,
            "score_format": 0.8,
            "score_skills": 0.6,
            "score_experience": 0.7,
            "red_flags": "OpenAI API not configured",
            "positive_indicators": "Mock analysis",
            "strengths": "Mock analysis",
            "weaknesses": "Mock analysis",
            "suggestions": "Configure OpenAI API key for real analysis"
        }
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that analyzes resumes and returns JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )
    content = response.choices[0].message.content

    # Clean code block markers if present
    if content.startswith("```json"):
        content = content.strip("```json").strip("```").strip()
    elif content.startswith("```"):
        content = content.strip("```").strip()

    return json.loads(content)

def call_ai_resume_job_match(resume_text, job_title, job_description):
    """
    Call OpenAI GPT to analyze resume fit against a job description, returning structured match results as a dict
    """
    prompt = f"""
You are a recruitment AI assistant.

Given the job title and description, and a candidate's resume text,
return a JSON with:
- match_score: float 0-1 representing overall fit
- score_skills: float 0-1 representing skill match
- score_experience: float 0-1 representing experience match
- summary: brief summary of strengths and weaknesses for this job

Respond ONLY with valid JSON.

Job Title:
{job_title}

Job Description:
{job_description}

Resume Text:
{resume_text[:3000]}
"""
    if not client:
        return {
            "match_score": 0.7,
            "score_skills": 0.6,
            "score_experience": 0.7,
            "summary": "Mock analysis - OpenAI API not configured"
        }
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful AI recruitment assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )
    content = response.choices[0].message.content

    # Clean code block markers if present
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].strip()

    return json.loads(content)
