from fastapi import APIRouter
from app.models.user_office import UserOffice
from app.schemas.user_office_schema import UserOfficeCreate, UserOfficeResponse
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from app.models.user import User
from app.models.office import Office

from app.core.permissions import require_admin

router = APIRouter(
    prefix="/user-offices",
    tags=["User Offices"]
)

@router.post("/", response_model=UserOfficeResponse)
def create_user_office(user_office: UserOfficeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    print("user:", user_office.user_id, "office:", user_office.office_id)
    existing_user = db.query(User).filter(
        User.id == user_office.user_id,
        User.is_active == True
    ).first()
    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="El usuario seleccionado no existe"
        )
    

    existing_office = db.query(Office).filter(
        Office.id == user_office.office_id,
        Office.is_active == True
    ).first()
    if not existing_office:
        raise HTTPException(
            status_code=404,
            detail="La oficina seleccionada no existe"
        )
    
    
    existing_user_office = db.query(UserOffice).filter(
        UserOffice.user_id == user_office.user_id,
        UserOffice.office_id == user_office.office_id
    ).first()

    if existing_user_office:
        raise HTTPException(
            status_code=400,
            detail="El usuario seleccionado ya tiene acceso a la oficina"
        )


    new_user_office = UserOffice(
        user_id=user_office.user_id,
        office_id=user_office.office_id
    )

    try:
        db.add(new_user_office)
        db.commit()
        db.refresh(new_user_office)
        return new_user_office
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error al asignar el usuario a la oficina"
        )

@router.get("/", response_model=list[UserOfficeResponse])
def get_user_offices(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user_offices = db.query(UserOffice).all()
    return user_offices

@router.get("/user/{user_id}", response_model=list[UserOfficeResponse])
def get_offices_by_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user_offices = db.query(UserOffice).filter(
        UserOffice.user_id == user_id
    ).all()

    if not user_offices:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron oficinas para el usuario especificado"
        )

    return user_offices

@router.get("/office/{office_id}", response_model=list[UserOfficeResponse])
def get_users_by_office(office_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user_offices = db.query(UserOffice).filter(
        UserOffice.office_id == office_id
    ).all()

    if not user_offices:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron usuarios para la oficina especificada"
        )

    return user_offices

@router.delete("/{user_office_id}", status_code=200)
def delete_user_office(user_office_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user_office = db.query(UserOffice).filter(
        UserOffice.id == user_office_id
    ).first()

    if not user_office:
        raise HTTPException(
            status_code=404,
            detail="La asignación de usuario a oficina no existe"
        )

    try:
        db.delete(user_office)
        db.commit()
        return {
            "message": "Permiso de acceso a oficina eliminado exitosamente"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error al eliminar la asignación de usuario a oficina"
        )