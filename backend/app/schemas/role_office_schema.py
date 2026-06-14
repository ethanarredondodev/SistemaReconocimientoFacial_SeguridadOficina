from app.schemas.office_schema import OfficeResponse
from app.schemas.role_schema import RoleResponse
from pydantic import BaseModel

class RoleOfficeResponse(BaseModel):
    id: int
    role: RoleResponse
    office: OfficeResponse

    class Config:
        from_attributes = True

class RoleOfficeCreate(BaseModel):
    role_id: int
    office_id: int