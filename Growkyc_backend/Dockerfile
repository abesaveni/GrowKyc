# Multi-stage build for KYC Backend

# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Build into an isolated virtualenv (world-readable at /opt/venv).
# NOTE: the previous `pip install --user` placed packages under /root/.local,
# which the non-root runtime user (kyc_user) could not traverse (/root is 0700),
# causing "permission denied" on gunicorn/celery. A venv under /opt fixes that.
RUN python -m venv /opt/venv
ENV PATH=/opt/venv/bin:$PATH

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy the virtualenv from the builder (owned by root, but readable+executable
# by all users because /opt is traversable, unlike /root).
COPY --from=builder /opt/venv /opt/venv

# Set environment variables
ENV PATH=/opt/venv/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 kyc_user && \
    chown -R kyc_user:kyc_user /app

USER kyc_user

# Expose port
EXPOSE 8000

# Health check — wget is always available; avoids needing 'requests' in the runtime image
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:8000/health || exit 1

# Run application (compose overrides this with gunicorn for the API service)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
