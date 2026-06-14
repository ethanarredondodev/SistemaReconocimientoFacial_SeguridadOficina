from pydantic import BaseModel
from datetime import datetime
from app.schemas.user_schema import UserResponse
from app.schemas.office_schema import OfficeResponse

class AccessLogResponse(BaseModel):
    id: int
    access_result: str
    confidence: float
    access_time: datetime

    user: UserResponse | None
    office: OfficeResponse

    class Config:
        from_attributes = True