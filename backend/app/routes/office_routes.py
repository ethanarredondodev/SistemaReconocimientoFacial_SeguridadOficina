from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.office import Office
from app.schemas.office_schema import OfficeCreate, OfficeResponse, OfficeUpdate
from app.core.permissions import require_admin


router = APIRouter(
    prefix="/offices",
    tags=["Offices"]
)

@router.post("/", response_model=OfficeResponse)
def create_office(office: OfficeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    existing_office = db.query(Office).filter(
        func.lower(Office.name) == func.lower(office.name),
        Office.is_active == True
    ).first()

    if existing_office:
        raise HTTPException(status_code=400, detail="Office with that name already exists")

    new_office = Office(**office.model_dump())

    try:
        db.add(new_office)
        db.commit()
        db.refresh(new_office)
        return new_office
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create office")
    

@router.get("/", response_model=list[OfficeResponse])
def get_offices(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    offices = db.query(Office).filter(Office.is_active == True).all()
    return offices

@router.get("/{office_id}", response_model=OfficeResponse)
def get_office(office_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    office = db.query(Office).filter(
        Office.id == office_id,
        Office.is_active == True
    ).first()

    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    return office

@router.patch("/{office_id}", response_model=OfficeResponse)
def update_office(office_id: int, updated_office: OfficeUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    office = db.query(Office).filter(
        Office.id == office_id,
        Office.is_active == True
    ).first()

    if not office:
        raise HTTPException(status_code=404, detail="Office not found")

    if updated_office.name is not None and updated_office.name != office.name:
        existing_office = db.query(Office).filter(
            func.lower(Office.name) == func.lower(updated_office.name),
            Office.is_active == True,
            Office.id != office_id
        ).first()

        if existing_office:
            raise HTTPException(status_code=400, detail="Another office with that name already exists")
        office.name = updated_office.name
    
    if updated_office.description is not None:
        office.description = updated_office.description

    try:
        db.commit()
        db.refresh(office)
        return office
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update office")


@router.delete("/{office_id}/deactivate", response_model=OfficeResponse)
def deactivate_office(office_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    existing_office = db.query(Office).filter(
        Office.id == office_id,
        Office.is_active == True
    ).first()

    if not existing_office:
        raise HTTPException(status_code=404, detail="Office not found")

    if existing_office.role_offices:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate office because it is assigned to roles"
        )
    if existing_office.user_offices:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate office because it is assigned to users"
        )

    existing_office.is_active = False

    try:
        db.commit()
        db.refresh(existing_office)
        return existing_office
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to deactivate office")