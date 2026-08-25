# Backend Dockerfile (FastAPI)
# =============================
# Optimized for production with Hugging Face Spaces compatibility

FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# PORT default: 7860 for HF Spaces, overridden by Render/Railway at runtime
ENV PORT=7860

# Create non-root user for security
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (Hugging Face requires 7860)
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the application.
#
# ONE worker, deliberately. Render's free tier gives 512MB and 0.1 CPU. The
# import graph here (langgraph + litellm + Agents SDK + MCP) costs ~270MB
# per process, so two workers measured 404MB idle with a key set and the
# service restarted intermittently under load — every endpoint dropping
# together, then recovering. A second worker also buys nothing on 0.1 CPU,
# where the two can never run in parallel.
#
# mcp_server.py keeps stateless_http=True regardless. It is what makes this
# safe to scale back up, and turning it off because there is only one worker
# today would plant the bug for whoever raises this number tomorrow.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1
