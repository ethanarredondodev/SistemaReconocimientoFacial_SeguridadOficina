from typing import Optional
from pydantic import BaseModel

class FaceUserResponse(BaseModel):
    id: int
    full_name: str


class FaceOfficeResponse(BaseModel):
    id: int
    name: str


class FaceAccessResponse(BaseModel):
    access_result: str
    confidence: float

    user: Optional[FaceUserResponse] = None
    office: Optional[FaceOfficeResponse] = None