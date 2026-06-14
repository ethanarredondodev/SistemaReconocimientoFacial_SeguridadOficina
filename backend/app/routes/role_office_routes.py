from app.schemas.role_office_schema import RoleOfficeCreate, RoleOfficeResponse
from app.models.role_office import RoleOffice

from app.models.office import Office
from app.models.role import Role

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

from fastapi import APIRouter
from app.models.user import User
from app.core.permissions import require_admin

router = APIRouter(
    prefix="/role-offices",
    tags=["Role-Offices"]
)

@router.post("/", response_model=RoleOfficeResponse)
def create_role_office(role_office: RoleOfficeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    
    existing_role = db.query(Role).filter(
        Role.id == role_office.role_id,
        Role.is_active == True
    ).first()
    if not existing_role:
        raise HTTPException(
            status_code=404,
            detail="El rol seleccionado no existe"
        )
    

    existing_office = db.query(Office).filter(
        Office.id == role_office.office_id,
        Office.is_active == True
    ).first()
    if not existing_office:
        raise HTTPException(
            status_code=404,
            detail="La oficina seleccionada no existe"
        )
    
    
    existing_role_office = db.query(RoleOffice).filter(
        RoleOffice.role_id == role_office.role_id,
        RoleOffice.office_id == role_office.office_id
    ).first()

    if existing_role_office:
        raise HTTPException(
            status_code=400,
            detail="El rol seleccionado ya tiene acceso a la oficina"
        )


    new_role_office = RoleOffice(
        role_id=role_office.role_id,
        office_id=role_office.office_id
    )

    try:
        db.add(new_role_office)
        db.commit()
        db.refresh(new_role_office)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error al crear la relación rol-oficina"
        )

    return new_role_office


@router.get("/", response_model=list[RoleOfficeResponse])
def get_role_offices(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    role_offices = db.query(RoleOffice).all()
    return role_offices


@router.get("/role/{role_id}", response_model=list[RoleOfficeResponse])
def get_offices_by_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    role_office = db.query(RoleOffice).filter(
        RoleOffice.role_id == role_id
    ).all()

    if not role_office:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron oficinas permitidas para el rol especificado"
        )

    return role_office

@router.get("/office/{office_id}", response_model=list[RoleOfficeResponse])
def get_roles_by_office(office_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    role_office = db.query(RoleOffice).filter(
        RoleOffice.office_id == office_id
    ).all()

    if not role_office:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron roles con acceso para la oficina especificada"
        )

    return role_office

@router.delete("/{role_office_id}", status_code=200)
def delete_role_office(role_office_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    role_office = db.query(RoleOffice).filter(
        RoleOffice.id == role_office_id
    ).first()

    if not role_office:
        raise HTTPException(
            status_code=404,
            detail="Relación rol-oficina no encontrada"
        )

    try:
        db.delete(role_office)
        db.commit()
        return {
            "message": "Permiso de acceso a oficina eliminado exitosamente"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error al eliminar la relación rol-oficina"
        )