# Root Dockerfile for Render.com deployment
# ==========================================
# Build context is the repo root; backend/ contains all Python source.
# Render picks up this file automatically when no Root Directory is set.

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# PORT default: 7860 for HF Spaces; Render overrides at runtime
ENV PORT=7860

# Create non-root user for security
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first for layer caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1
