from pydantic import BaseModel


class PatientOptions(BaseModel):
    gender: list[str]
    ward: list[str]
    department: list[str]
    doctor: list[str]
