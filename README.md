# DScribe Patient Admission Management System

A responsive patient admission dashboard built with React, FastAPI, and PostgreSQL.

## Features

- Add, view, edit, and delete patients
- Search and combined Ward, Department, and Doctor filters
- Discharge admitted patients
- Backend-authoritative validation and parameterized SQL
- Loading, error, empty, and confirmation states
- Responsive desktop, tablet, and mobile layouts

## Technology Stack

- Frontend: React, Vite, JavaScript, Axios, React Router, Lucide React
- Backend: Python 3.14, FastAPI, Pydantic, Psycopg 3, Uvicorn
- Database: Neon PostgreSQL 18.7 or local PostgreSQL 17, accessed with Psycopg 3

## Architecture

The React frontend communicates with FastAPI through REST endpoints under `/api` and does not connect directly to the database. FastAPI routes handle HTTP requests, Pydantic schemas validate request payloads, and services execute parameterized raw PostgreSQL SQL through Psycopg 3.

```text
React + Vite + Axios
        |
        | HTTP /api
        v
FastAPI + Pydantic
        |
        | Psycopg 3
        v
Neon PostgreSQL 18.7 or local PostgreSQL 17
```

The database initializer executes [database/schema.sql](database/schema.sql) within a transaction and uses `CREATE TABLE IF NOT EXISTS`; it does not create or delete databases, drop tables, or remove existing records.

## Local Setup

### PostgreSQL

Install PostgreSQL 17 and ensure the service is running. Create credentials or reuse a local PostgreSQL user.

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` with the local database settings or a Neon `DATABASE_URL`. Keep `.env` private and never commit credentials. Start the backend in a first terminal:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8002
```

### Frontend

Start the frontend in a separate terminal:

```powershell
cd frontend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Open <http://localhost:5173>. Swagger documentation is available at <http://localhost:8002/docs>.

The frontend `.env.example` provides `VITE_API_URL`, while `backend/.env.example` provides local PostgreSQL defaults and CORS configuration.

## Environment Variables

Backend:

| Variable | Purpose |
|---|---|
| DATABASE_URL | Primary PostgreSQL connection string, including the Neon connection string when hosted |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name, normally `hospital_management` |
| DB_USER | PostgreSQL user |
| DB_PASSWORD | PostgreSQL password |
| CORS_ORIGINS | Comma-separated frontend origins |
| APP_ENV | Application environment; sample seeding is refused in `production` |
| ALLOW_SAMPLE_DATA_SEEDING | Set to `true` only to enable local sample seeding |

Frontend:

| Variable | Purpose |
|---|---|
| VITE_API_URL | FastAPI base URL |

`DATABASE_URL` takes priority when it is set. A Neon connection is detected from the URL and uses `sslmode=require`. When `DATABASE_URL` is absent, the backend uses the local `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` variables.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/patients` | List/search/filter patients |
| GET | `/api/patients/{id}` | Get one patient |
| POST | `/api/patients` | Create patient |
| PUT | `/api/patients/{id}` | Update patient |
| DELETE | `/api/patients/{id}` | Delete patient |
| PATCH | `/api/patients/{id}/discharge` | Discharge patient |
| GET | `/api/options` | Get dropdown values |

## Database Schema

The schema is in [database/schema.sql](database/schema.sql). Database initialization is handled by `backend/app/database/init_db.py`.

For Neon, set `DATABASE_URL` to the hosted PostgreSQL connection string. Startup executes `database/schema.sql` against the selected database; it is idempotent and does not overwrite or delete existing records. For local development, leave `DATABASE_URL` unset and configure the `DB_*` variables.

## Local Sample Data

The optional seed script inserts ten fictional patients and records their seed keys so repeat runs do not duplicate them. It never deletes existing records and refuses to run unless explicitly enabled; do not enable sample seeding in production.

```powershell
cd backend
$env:ALLOW_SAMPLE_DATA_SEEDING="true"
python -m scripts.seed_sample_patients
Remove-Item Env:ALLOW_SAMPLE_DATA_SEEDING
```

The seed script uses the effective backend connection configuration, rejects Neon and any non-local host, and also refuses production environments and disabled seeding.

## Testing

Run the backend test suite from the backend directory:

```powershell
cd backend
python -m pytest
```

The available tests cover patient CRUD, discharge, search and combined filters, persistence across application restarts, dropdown options, local CORS origins, Pydantic validation, and invalid patient values.

## Deployment

For a hosted deployment, set `DATABASE_URL` to the Neon PostgreSQL connection string and set `CORS_ORIGINS` to the frontend public origin. Deploy FastAPI with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, and build the Vite frontend with `VITE_API_URL` set to the public backend URL.
