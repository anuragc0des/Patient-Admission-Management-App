import os
from datetime import date, timedelta

from dotenv import load_dotenv

from app.database.connection import database_connection

load_dotenv()


SAMPLE_PATIENTS = [
    ("sample-001", "Aarav Sharma", 8, "Male", "Pediatrics", "Pediatrics", "Dr. Priya Sharma", 3, "Admitted"),
    ("sample-002", "Meera Iyer", 42, "Female", "General Ward", "Cardiology", "Dr. Asha Verma", 5, "Admitted"),
    ("sample-003", "Kabir Patel", 67, "Male", "ICU", "Neurology", "Dr. Rahul Mehta", 2, "Admitted"),
    ("sample-004", "Ananya Das", 29, "Female", "Maternity", "General Medicine", "Dr. Neha Kapoor", 11, "Discharged"),
    ("sample-005", "Rohan Nair", 54, "Male", "General Ward", "Orthopedics", "Dr. Vikram Singh", 7, "Admitted"),
    ("sample-006", "Sara Khan", 35, "Female", "Emergency", "General Medicine", "Dr. Asha Verma", 14, "Discharged"),
    ("sample-007", "Dev Malhotra", 73, "Male", "ICU", "Cardiology", "Dr. Rahul Mehta", 1, "Admitted"),
    ("sample-008", "Ishita Roy", 16, "Female", "Pediatrics", "Pediatrics", "Dr. Priya Sharma", 9, "Discharged"),
    ("sample-009", "Arjun Reddy", 48, "Male", "General Ward", "Oncology", "Dr. Neha Kapoor", 4, "Admitted"),
    ("sample-010", "Nisha Menon", 61, "Female", "General Ward", "Neurology", "Dr. Vikram Singh", 20, "Discharged"),
]

SEED_LOCK_ID = 584_271_903


def seed_sample_patients() -> tuple[int, int]:
    if os.getenv("ALLOW_SAMPLE_DATA_SEEDING", "").lower() != "true":
        raise RuntimeError(
            "Sample seeding is disabled. Set ALLOW_SAMPLE_DATA_SEEDING=true "
            "explicitly for a local development database."
        )
    if os.getenv("APP_ENV", "development").lower() == "production":
        raise RuntimeError("Sample patient data cannot be seeded in production.")
    if os.getenv("DB_HOST", "localhost").lower() not in {"localhost", "127.0.0.1", "::1"}:
        raise RuntimeError("Sample patient data can only be seeded into a local PostgreSQL database.")

    inserted = 0
    skipped = 0
    with database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_advisory_xact_lock(%s)", (SEED_LOCK_ID,))
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS sample_patient_seeds (
                    seed_key VARCHAR(50) PRIMARY KEY,
                    patient_id INTEGER NOT NULL UNIQUE
                        REFERENCES patients(id) ON DELETE CASCADE
                )
                """
            )

            for seed_key, name, age, gender, ward, department, doctor, days_ago, status in SAMPLE_PATIENTS:
                cursor.execute(
                    "SELECT 1 FROM sample_patient_seeds WHERE seed_key = %s",
                    (seed_key,),
                )
                if cursor.fetchone():
                    skipped += 1
                    continue

                cursor.execute(
                    """
                    INSERT INTO patients
                        (name, age, gender, ward, department, doctor, admission_date, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (
                        name,
                        age,
                        gender,
                        ward,
                        department,
                        doctor,
                        date.today() - timedelta(days=days_ago),
                        status,
                    ),
                )
                patient_id = cursor.fetchone()[0]
                cursor.execute(
                    """
                    INSERT INTO sample_patient_seeds (seed_key, patient_id)
                    VALUES (%s, %s)
                    """,
                    (seed_key, patient_id),
                )
                inserted += 1

        connection.commit()

    return inserted, skipped


if __name__ == "__main__":
    inserted_count, skipped_count = seed_sample_patients()
    print(f"Sample data seed complete: {inserted_count} inserted, {skipped_count} already present.")
