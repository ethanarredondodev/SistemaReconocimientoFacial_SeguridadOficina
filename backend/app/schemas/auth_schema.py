from app.schemas.user_schema import UserResponse
from pydantic import BaseModel, EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    sub: str | None = None
    role_id: int | None = None
    role_name: str | None = None