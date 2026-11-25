from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.patient import PatientCreate, PatientResponse, PatientUpdate
from app.services import patient_service

router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.get("", response_model=list[PatientResponse])
def get_patients(
    search: str | None = Query(default=None),
    ward: str | None = Query(default=None),
    department: str | None = Query(default=None),
    doctor: str | None = Query(default=None),
):
    return patient_service.list_patients(search, ward, department, doctor)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int):
    patient = patient_service.get_patient(patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate):
    return patient_service.create_patient(patient)


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, patient: PatientUpdate):
    existing = patient_service.get_patient(patient_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_service.update_patient(patient_id, patient)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int):
    if not patient_service.delete_patient(patient_id):
        raise HTTPException(status_code=404, detail="Patient not found")
    return None


@router.patch("/{patient_id}/discharge", response_model=PatientResponse)
def discharge_patient(patient_id: int):
    existing = patient_service.get_patient(patient_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_service.discharge_patient(patient_id)
