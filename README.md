# DScribe Patient Admission Management System

A responsive patient admission dashboard built with React, FastAPI, and PostgreSQL 17.

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
- Database: PostgreSQL 17

## Architecture

The React frontend calls REST endpoints under `/api`. FastAPI routes contain HTTP concerns, services execute raw PostgreSQL SQL, and Pydantic schemas validate request payloads. The database initializer creates `hospital_management` and the `patients` table without deleting existing records.

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

Edit `backend/.env` with the local database host, user, password, and database name. Start the server:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8123
```

### Frontend

```powershell
cd frontend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Open <http://localhost:5173>. Swagger documentation is available at <http://localhost:8123/docs>.

## Environment Variables

Backend:

| Variable | Purpose |
|---|---|
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name, normally `hospital_management` |
| DB_USER | PostgreSQL user |
| DB_PASSWORD | PostgreSQL password |
| CORS_ORIGINS | Comma-separated frontend origins |

Frontend:

| Variable | Purpose |
|---|---|
| VITE_API_URL | FastAPI base URL |

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

## Local Sample Data

The optional seed script inserts ten fictional patients and records their seed keys so repeat runs do not duplicate them. It never deletes existing records and refuses to run unless explicitly enabled; do not enable sample seeding in production.

```powershell
cd backend
$env:ALLOW_SAMPLE_DATA_SEEDING="true"
python -m scripts.seed_sample_patients
Remove-Item Env:ALLOW_SAMPLE_DATA_SEEDING
```

## Deployment

Deploy PostgreSQL on a managed provider, set `DB_*` variables in the backend environment, and set `CORS_ORIGINS` to the frontend public origin. Deploy the FastAPI application with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Deploy the Vite frontend with `VITE_API_URL` set to the public backend URL and serve the `dist` directory with a Vite-compatible static host.
