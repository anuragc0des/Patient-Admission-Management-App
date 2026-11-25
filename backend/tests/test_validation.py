from datetime import date, timedelta

import pytest
from pydantic import ValidationError

from app.schemas.patient import PatientCreate


BASE_PATIENT = {
    "name": "Anita Rao",
    "age": 34,
    "gender": "Female",
    "ward": "General Ward",
    "department": "General Medicine",
    "doctor": "Dr. Asha Verma",
    "admission_date": date.today(),
}


def test_valid_patient():
    patient = PatientCreate(**BASE_PATIENT)
    assert patient.name == "Anita Rao"


@pytest.mark.parametrize("name", ["", "A1", "Ria@", "  "])
def test_invalid_names(name):
    with pytest.raises(ValidationError):
        PatientCreate(**{**BASE_PATIENT, "name": name})


@pytest.mark.parametrize("age", [-1, 121])
def test_age_boundaries(age):
    with pytest.raises(ValidationError):
        PatientCreate(**{**BASE_PATIENT, "age": age})


def test_invalid_dropdown_option():
    with pytest.raises(ValidationError):
        PatientCreate(**{**BASE_PATIENT, "doctor": "Unknown Doctor"})


def test_future_admission_date():
    with pytest.raises(ValidationError):
        PatientCreate(**{**BASE_PATIENT, "admission_date": date.today() + timedelta(days=1)})

