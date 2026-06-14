from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.role import Role
from app.models.user import User
from app.schemas.user_schema import UserResponse

from app.core.security import hash_password
from app.core.permissions import require_admin

import os
import shutil

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/register")
def register_user(
    full_name: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(...),
    role_id: int = Form(...),
    face_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )


    role_exists = db.query(Role).filter(
        Role.id == role_id
    ).first()

    if not role_exists:
        raise HTTPException(
            status_code=400,
            detail="Role does not exist"
        )


    new_user = User(
        full_name=full_name,
        email=email,
        password=hash_password(password),
        role_id=role_id,
        face_image=None
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        os.makedirs(
            "storage/faces",
            exist_ok=True
        )

        file_path = (
            f"storage/faces/user_{new_user.id}.jpg"
        )
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                face_image.file,
                buffer
            )

        new_user.face_image = file_path
        db.commit()

        return {
            "message": "User registered successfully",
            "user_id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "role": {
                "id": new_user.role.id,
                "name": new_user.role.name
            },
            "face_image": file_path
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while registering the user"
        )
    

@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    users = db.query(User).filter(User.is_active == True).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(
        User.id == user_id, User.is_active == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@router.delete("/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(
        User.id == user_id, User.is_active == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    try:
        user.is_active = False
        db.commit()
        return {
            "message": "User deactivated successfully"
        }
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while deactivating the user"
        )

@router.patch("/{user_id}/activate")
def activate_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(
        User.id == user_id, User.is_active == False
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    try:
        user.is_active = True
        db.commit()
        return {
            "message": "User activated successfully"
        }
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while activating the user"
        )


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    full_name: str = Form(None),
    email: EmailStr = Form(None),
    password: str = Form(None),
    role_id: int = Form(None),
    face_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(
        User.id == user_id, User.is_active == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if full_name is not None:
        user.full_name = full_name

    if email is not None:
        existing_email = db.query(User).filter(
            User.email == email,
            User.id != user_id,
            User.is_active == True
        ).first()

        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )
        
        user.email = email

    if password is not None and password.strip() != "":
        user.password = hash_password(password)

    if role_id is not None:
        role_exists = db.query(Role).filter(
            Role.id == role_id
        ).first()

        if not role_exists:
            raise HTTPException(
                status_code=400,
                detail="Role does not exist"
            )
        user.role_id = role_id

    try:
        if face_image is not None:
            file_path = (
                f"storage/faces/user_{user.id}.jpg"
            )
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(
                    face_image.file,
                    buffer
                )
            user.face_image = file_path

        db.commit()
        db.refresh(user)

        return user

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while updating the user"
        )