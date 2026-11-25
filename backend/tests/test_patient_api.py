from datetime import date

from fastapi.testclient import TestClient

from app.main import app


def test_patient_crud_filters_and_persistence_across_app_restart():
    patient_data = {
        "name": "Api Smoke Patient",
        "age": 46,
        "gender": "Female",
        "ward": "General Ward",
        "department": "Cardiology",
        "doctor": "Dr. Asha Verma",
        "admission_date": date.today().isoformat(),
    }
    patient_id = None

    try:
        with TestClient(app) as client:
            created_response = client.post("/api/patients", json=patient_data)
            assert created_response.status_code == 201
            created_patient = created_response.json()
            patient_id = created_patient["id"]
            assert created_patient["status"] == "Admitted"

            patient_response = client.get(f"/api/patients/{patient_id}")
            assert patient_response.status_code == 200
            assert patient_response.json()["name"] == patient_data["name"]

            filtered_response = client.get(
                "/api/patients",
                params={
                    "search": "smoke",
                    "ward": patient_data["ward"],
                    "department": patient_data["department"],
                    "doctor": patient_data["doctor"],
                },
            )
            assert any(row["id"] == patient_id for row in filtered_response.json())

            updated_data = {**patient_data, "age": 47, "status": "Admitted"}
            updated_response = client.put(
                f"/api/patients/{patient_id}",
                json=updated_data,
            )
            assert updated_response.status_code == 200
            assert updated_response.json()["age"] == 47

            discharged_response = client.patch(f"/api/patients/{patient_id}/discharge")
            assert discharged_response.status_code == 200
            assert discharged_response.json()["status"] == "Discharged"

        with TestClient(app) as restarted_client:
            persisted_response = restarted_client.get(f"/api/patients/{patient_id}")
            assert persisted_response.status_code == 200
            assert persisted_response.json()["status"] == "Discharged"

            delete_response = restarted_client.delete(f"/api/patients/{patient_id}")
            assert delete_response.status_code == 204
            assert restarted_client.get(f"/api/patients/{patient_id}").status_code == 404
    finally:
        if patient_id is not None:
            with TestClient(app) as cleanup_client:
                cleanup_client.delete(f"/api/patients/{patient_id}")
