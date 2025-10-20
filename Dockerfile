# ---- Build a tiny, production Python image ----
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# System deps (optional but handy for psycopg, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Create app dir
WORKDIR /app

# Copy backend only (keeps image smaller)
COPY backend/ /app/

# Install Python deps
RUN python -m pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose the port Railway expects
EXPOSE 8080

# Start FastAPI with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
