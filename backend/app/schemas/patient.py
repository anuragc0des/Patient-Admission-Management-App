import re
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.config.options import GENDER_OPTIONS, WARD_OPTIONS, DEPARTMENT_OPTIONS, DOCTOR_OPTIONS


class PatientBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    age: int = Field(strict=True, ge=0, le=120)
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Name is required")
        if not re.fullmatch(r"[A-Za-z ]+", cleaned):
            raise ValueError("Name must contain only alphabetic letters and spaces")
        return cleaned

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value: str) -> str:
        if value not in GENDER_OPTIONS:
            raise ValueError("Invalid gender option")
        return value

    @field_validator("ward")
    @classmethod
    def validate_ward(cls, value: str) -> str:
        if value not in WARD_OPTIONS:
            raise ValueError("Invalid ward option")
        return value

    @field_validator("department")
    @classmethod
    def validate_department(cls, value: str) -> str:
        if value not in DEPARTMENT_OPTIONS:
            raise ValueError("Invalid department option")
        return value

    @field_validator("doctor")
    @classmethod
    def validate_doctor(cls, value: str) -> str:
        if value not in DOCTOR_OPTIONS:
            raise ValueError("Invalid doctor option")
        return value

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Admission date cannot be in the future")
        return value


class PatientCreate(PatientBase):
    pass


class PatientUpdate(PatientBase):
    status: Literal["Admitted", "Discharged"]


class PatientResponse(PatientBase):
    id: int
    status: Literal["Admitted", "Discharged"]
    created_at: datetime | None = None
    updated_at: datetime | None = None
