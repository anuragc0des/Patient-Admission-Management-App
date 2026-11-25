from datetime import datetime

from psycopg.rows import dict_row

from app.database.connection import database_connection
from app.schemas.patient import PatientCreate, PatientUpdate


def _dict_cursor(connection):
    return connection.cursor(row_factory=dict_row)


def list_patients(search: str | None = None, ward: str | None = None,
                  department: str | None = None, doctor: str | None = None):
    conditions = []
    parameters = []

    if search:
        conditions.append("LOWER(name) LIKE LOWER(%s)")
        parameters.append(f"%{search.strip()}%")
    if ward:
        conditions.append("ward = %s")
        parameters.append(ward)
    if department:
        conditions.append("department = %s")
        parameters.append(department)
    if doctor:
        conditions.append("doctor = %s")
        parameters.append(doctor)

    query = "SELECT * FROM patients"
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += " ORDER BY created_at DESC, id DESC"

    with database_connection() as connection:
        with _dict_cursor(connection) as cursor:
            cursor.execute(query, parameters)
            return cursor.fetchall()


def get_patient(patient_id: int):
    with database_connection() as connection:
        with _dict_cursor(connection) as cursor:
            cursor.execute("SELECT * FROM patients WHERE id = %s", (patient_id,))
            return cursor.fetchone()


def create_patient(patient: PatientCreate):
    with database_connection() as connection:
        with _dict_cursor(connection) as cursor:
            cursor.execute(
                """
                INSERT INTO patients
                    (name, age, gender, ward, department, doctor, admission_date, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'Admitted')
                RETURNING *
                """,
                (
                    patient.name,
                    patient.age,
                    patient.gender,
                    patient.ward,
                    patient.department,
                    patient.doctor,
                    patient.admission_date,
                ),
            )
            created = cursor.fetchone()
        connection.commit()
        return created


def update_patient(patient_id: int, patient: PatientUpdate):
    with database_connection() as connection:
        with _dict_cursor(connection) as cursor:
            cursor.execute(
                """
                UPDATE patients
                SET name = %s,
                    age = %s,
                    gender = %s,
                    ward = %s,
                    department = %s,
                    doctor = %s,
                    admission_date = %s,
                    status = %s,
                    updated_at = %s
                WHERE id = %s
                RETURNING *
                """,
                (
                    patient.name,
                    patient.age,
                    patient.gender,
                    patient.ward,
                    patient.department,
                    patient.doctor,
                    patient.admission_date,
                    patient.status,
                    datetime.now(),
                    patient_id,
                ),
            )
            updated = cursor.fetchone()
        connection.commit()
        return updated


def delete_patient(patient_id: int) -> bool:
    with database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM patients WHERE id = %s", (patient_id,))
            deleted = cursor.rowcount > 0
        connection.commit()
        return deleted


def discharge_patient(patient_id: int):
    with database_connection() as connection:
        with _dict_cursor(connection) as cursor:
            cursor.execute(
                """
                UPDATE patients
                SET status = 'Discharged', updated_at = %s
                WHERE id = %s
                RETURNING *
                """,
                (datetime.now(), patient_id),
            )
            discharged = cursor.fetchone()
        connection.commit()
        return discharged
