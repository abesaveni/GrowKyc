Growkyc Backend — Setup & Quick Start

Requirements
- Python 3.10
- pip
- (optional) virtualenv or venv

1. Create and activate a virtual environment

Windows (PowerShell):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Environment
- Copy `.env.example` to `.env` and set any local values (DB path, secrets).
- By default the project uses SQLite for local development.

4. Initialize database (development)
- The app will auto-create tables on first run in the default config.
- If using migrations, run your migration tool (project includes `database/migrations/`).

5. Run the app locally

```bash
uvicorn main:app --reload
```

- API docs are available at `http://127.0.0.1:8000/docs` (Swagger) and Redoc at `/redoc`.

6. Run tests

```bash
# from Growkyc_backend
pytest -q
```

Notes
- Use the provided `.vscode/launch.json` to debug the server from VS Code.
- The backend folder is self-contained for development; do not move files without updating `PYTHONPATH`.
