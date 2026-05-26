Deployment notes (concise)

1) Environment & secrets
- Use a secure secret store for JWT secret and DB credentials.
- Set `ENVIRONMENT=production` and configure `DATABASE_URL` to your production DB.

2) DB migrations
- Apply migrations before app start (run your migration tool against production DB).
- Back up the DB prior to migration runs.

3) App server
- Run Uvicorn with multiple workers behind a reverse proxy (NGINX):
  - Example: `gunicorn -k uvicorn.workers.UvicornWorker -w 4 main:app`

4) Logging & monitoring
- Configure structured logging and forward logs to a central system.
- Add health checks and readiness endpoints in fronting load balancers.

5) Security
- Enforce TLS at the reverse proxy.
- Ensure CORS origins are restricted in production.
- Rotate secrets and use least privilege for DB users.

6) Scaling
- Use a managed RDBMS for production (Postgres recommended over SQLite).
- Use connection pooling and tune pool sizes per instance.

7) Rollback
- Keep a tested rollback plan (previous DB backups + previous image tags).

8) Notes specific to this repo
- The backend currently uses SQLAlchemy models and a SQLite default; switch to Postgres in production and run migrations accordingly.
