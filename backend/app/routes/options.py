from fastapi import APIRouter

from app.config.options import PATIENT_OPTIONS
from app.schemas.options import PatientOptions

router = APIRouter(prefix="/api", tags=["options"])


@router.get("/options")
def get_options() -> PatientOptions:
    return PATIENT_OPTIONS
