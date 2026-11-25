from pathlib import Path

from app.database.connection import database_connection


def initialize_database() -> None:
    schema_path = Path(__file__).resolve().parents[3] / "database" / "schema.sql"
    schema_sql = schema_path.read_text(encoding="utf-8")

    with database_connection() as connection:
        with connection.transaction():
            with connection.cursor() as cursor:
                cursor.execute(schema_sql)
