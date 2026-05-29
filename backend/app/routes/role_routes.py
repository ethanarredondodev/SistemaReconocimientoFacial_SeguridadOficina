from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.schemas.role_schema import RoleCreate, RoleResponse, RoleUpdate
from app.database import get_db
from app.models.role import Role

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.post("/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):

    existing_role = db.query(Role).filter(
        Role.name == role.name
    ).first()

    if existing_role:
        raise HTTPException(
            status_code=400,
            detail="Role already exists"
        )

    new_role = Role(
        name=role.name,
        description=role.description
    )

    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    return new_role
    

@router.get("/", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Role).filter(Role.is_active == True).all()
    return roles

@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(
        Role.id == role_id,
        Role.is_active == True
    ).first()

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )
    
    return role

@router.patch("/{role_id}", response_model=RoleResponse)
def update_role(role_id: int, update_data: RoleUpdate, db: Session = Depends(get_db)):

    role = db.query(Role).filter(
        Role.id == role_id,
        Role.is_active == True
    ).first()

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )

    if update_data.name is not None and update_data.name.strip() != "":
        existing_name = db.query(Role).filter(
            func.upper(Role.name) == update_data.name.upper(),
            Role.id != role_id,
            Role.is_active == True
        ).first()

        if existing_name:
            raise HTTPException(
                status_code=400,
                detail="Role name already exists"
            )
        
        role.name = update_data.name

    if update_data.description is not None and update_data.description.strip() != "":
         role.description = update_data.description

    try:
        db.commit()
        db.refresh(role)
        return role
    
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while updating the role"
        )

@router.delete("/{role_id}/deactivate")
def deactivate_role(role_id: int, db: Session = Depends(get_db)):

    role = db.query(Role).filter(
        Role.id == role_id,
        Role.is_active == True
    ).first()

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )

    if role.users:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate role because it is assigned to users"
        )

    role.is_active = False

    try:
        db.commit()
        return {"detail": "Role deactivated successfully"}
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while deactivating the role"
        )