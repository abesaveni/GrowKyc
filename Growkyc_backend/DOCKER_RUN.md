Docker run instructions (development)

Build image:

```bash
# from Growkyc_backend
docker build -t growkyc-backend:dev .
```

Run container (expose port 8000):

```bash
docker run --rm -it -p 8000:8000 \
  -e ENVIRONMENT=development \
  -e DATABASE_URL=sqlite:///./kyc.db \
  growkyc-backend:dev \
  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Using `docker-compose` (if `docker-compose.yml` present):

```bash
docker-compose up --build
```

Files to review
- `Dockerfile` and `docker-compose.yml` in the backend root — they contain build/runtime settings for containers.

Notes
- For production images remove `--reload` and use a production server configuration (Gunicorn/Uvicorn workers).
- Mount volumes for local code iteration when developing inside containers.
