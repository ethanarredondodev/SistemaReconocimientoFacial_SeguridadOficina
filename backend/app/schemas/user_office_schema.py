from pydantic import BaseModel
from app.schemas.user_schema import UserResponse
from app.schemas.office_schema import OfficeResponse

class UserOfficeResponse(BaseModel):
    id: int
    user: UserResponse
    office: OfficeResponse

    class Config:
        from_attributes = True

class UserOfficeCreate(BaseModel):
    user_id: int
    office_id: int