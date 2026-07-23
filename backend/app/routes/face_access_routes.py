from app.models.user_office import UserOffice
from app.schemas.face_access_schema import (
    FaceAccessResponse, 
    FaceUserResponse, 
    FaceOfficeResponse
)
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session
import uuid
import os

from app.database import get_db

from app.models.office import Office
from app.models.user import User
from app.models.access_log import AccessLog
from app.models.role_office import RoleOffice

from app.services.face_recognition_service import (
    recognize_face
)

router = APIRouter(
    prefix="/face-access",
    tags=["Face Access"]
)


@router.post("/verify", response_model=FaceAccessResponse)
def verify_access(
    office_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    office = db.query(Office).filter(
        Office.id == office_id,
        Office.is_active == True
    ).first()

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Oficina no encontrada"
        )

    result = recognize_face(uploaded_image=image, db=db)

    user = result["user"] if result else None
    confidence = float(result["confidence"]) if result and result.get("confidence") is not None else 0.0
    permission = None

    if user:
        permission = db.query(RoleOffice).filter(
            RoleOffice.role_id == user.role_id,
            RoleOffice.office_id == office_id
        ).first()

        if not permission:
            permission = db.query(UserOffice).filter(
                UserOffice.user_id == user.id,
                UserOffice.office_id == office_id
            ).first()

    access_result = "PERMITIDO" if (user and permission) else "DENEGADO"

    # Guardar captura solo si es desconocido
    capture_path = None
    if not user:
        os.makedirs("storage/captures", exist_ok=True)
        capture_path = f"storage/captures/unknown_{uuid.uuid4().hex[:8]}.jpg"
        image.file.seek(0)  # rebobinar porque recognize_face ya lo leyó
        with open(capture_path, "wb") as f:
            f.write(image.file.read())

    log = AccessLog(
        user_id=user.id if user else None,
        office_id=office_id,
        access_result=access_result,
        confidence=float(confidence),
        capture_image=capture_path
    )

    try:
        db.add(log)
        db.commit()
        db.refresh(log)
    except Exception as e:
        db.rollback()
        print("ERROR DB:", e)
        raise HTTPException(status_code=500, detail="Error al registrar el intento de acceso")

    return FaceAccessResponse(
        access_result=access_result,
        confidence=confidence,
        user=FaceUserResponse(
            id=user.id,
            full_name=user.full_name
        ) if user else None,
        office=FaceOfficeResponse(
            id=office.id,
            name=office.name
        ) if office else None
    )