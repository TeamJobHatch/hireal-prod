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
CMD flask db upgrade && gunicorn app:app --bind 0.0.0.0:8000
