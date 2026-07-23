from pydantic import BaseModel, EmailStr

from app.schemas.role_schema import RoleResponse

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: RoleResponse
    face_image: str | None = None
    is_active: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role_id: int

class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role_id: int | None = None
    is_active: bool | None = None



        