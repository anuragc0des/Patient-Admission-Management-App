import os
from contextlib import contextmanager

import psycopg
from dotenv import load_dotenv

load_dotenv()


def get_database_url() -> str:
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "hospital_management")
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD", "")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


def get_admin_database_url() -> str:
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD", "")
    return f"postgresql://{user}:{password}@{host}:{port}/postgres"


@contextmanager
def database_connection():
    connection = None
    try:
        connection = psycopg.connect(get_database_url())
        yield connection
    finally:
        if connection is not None:
            connection.close()
