# # Use official Python image based on Debian Bullseye
# FROM python:3.9.18-bullseye

# # Install build dependencies and PostgreSQL development libraries
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libpq-dev \
#     python3-dev \
#     gcc \
#     && rm -rf /var/lib/apt/lists/*

# # Define build-time arguments (can be passed with --build-arg)
# ARG FLASK_APP
# ARG FLASK_ENV
# ARG DATABASE_URL
# ARG SCHEMA
# ARG SECRET_KEY

# # Set working directory inside the container
# WORKDIR /var/www

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
# RUN pip install psycopg2

# # Copy application source code into the container
# COPY . .

# # Run database migration and seeding (for production use, move to entrypoint)
# RUN flask db upgrade
# RUN flask seed undo
# RUN flask seed all

# # Start the application using Gunicorn
# CMD gunicorn app:app --bind 0.0.0.0:8000


# Use official Python image based on Debian Bullseye
FROM python:3.9.18-bullseye

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .

# 不在 build 阶段执行数据库迁移和 seeding
# RUN flask db upgrade
# RUN flask seed undo
# RUN flask seed all

# 在容器启动时执行迁移和启动 Gunicorn
CMD flask db upgrade && flask seed undo && flask seed all && gunicorn app:app --bind 0.0.0.0:8000

