import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import psycopg

from app.database.init_db import initialize_database
from app.routes.options import router as options_router
from app.routes.patients import router as patients_router

load_dotenv()

app = FastAPI(title="DScribe Patient Admission Management API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
for origin in tuple(allowed_origins):
    if "://localhost" in origin:
        local_origin = origin.replace("://localhost", "://127.0.0.1", 1)
    elif "://127.0.0.1" in origin:
        local_origin = origin.replace("://127.0.0.1", "://localhost", 1)
    else:
        continue
    if local_origin not in allowed_origins:
        allowed_origins.append(local_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients_router)
app.include_router(options_router)


@app.exception_handler(psycopg.Error)
async def database_error_handler(request: Request, exc: psycopg.Error):
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred. Please try again."},
    )


@app.on_event("startup")
async def startup_event():
    initialize_database()
