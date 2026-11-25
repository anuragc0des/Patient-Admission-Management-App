# DScribe Backend

FastAPI backend for the Patient Admission Management System.

## Setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8123
```

Set the PostgreSQL values in `.env`, then open <http://localhost:8123/docs>. If using the default Uvicorn port, set `VITE_API_URL=http://localhost:8000` in the frontend environment instead.

## Optional Local Sample Data

From `backend`, run the seed script only against a local development database:

```powershell
$env:ALLOW_SAMPLE_DATA_SEEDING="true"
python -m scripts.seed_sample_patients
Remove-Item Env:ALLOW_SAMPLE_DATA_SEEDING
```

The script inserts ten fictional patients, does not remove existing rows, and skips seeds already inserted.

## Tests

```powershell
cd backend
$env:PYTHONPATH="."
python -m pytest -q
```
