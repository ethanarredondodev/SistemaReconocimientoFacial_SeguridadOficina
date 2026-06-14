from pydantic import BaseModel
from app.schemas.user_schema import UserResponse
from app.schemas.office_schema import OfficeResponse

class UserOfficeResponse(BaseModel):
    id: int
    user_id: UserResponse
    office_id: OfficeResponse

    class Config:
        from_attributes = True

class UserOfficeCreate(BaseModel):
    user_id: int
    office_id: int