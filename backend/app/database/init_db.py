import psycopg
import os
from psycopg import sql

from app.database.connection import get_admin_database_url, get_database_url


PATIENTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age BETWEEN 0 AND 120),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    ward VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    doctor VARCHAR(100) NOT NULL,
    admission_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Admitted'
        CHECK (status IN ('Admitted', 'Discharged')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


def initialize_database() -> None:
    database_name = os.getenv("DB_NAME", "hospital_management")

    with psycopg.connect(get_admin_database_url(), autocommit=True) as admin_connection:
        with admin_connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database_name,))
            exists = cursor.fetchone()
            if not exists:
                cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(database_name)))

    with psycopg.connect(get_database_url()) as connection:
        with connection.cursor() as cursor:
            cursor.execute(PATIENTS_TABLE_SQL)
        connection.commit()
