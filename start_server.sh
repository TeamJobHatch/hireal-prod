#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Set environment variables
export SECRET_KEY="dev-secret-key-change-in-production"
export FLASK_APP=app
export FLASK_ENV=development
export FLASK_DEBUG=true
export FLASK_RUN_PORT=8000
export DATABASE_URL="sqlite:///app.db"
export SCHEMA="hireal_schema"
export OPENAI_API_KEY="dummy-key"
export S3_KEY="dummy"
export S3_SECRET="dummy"
export S3_REGION="us-east-1"

# Start the Flask server
echo "Starting Flask server on http://localhost:8000"
flask run
