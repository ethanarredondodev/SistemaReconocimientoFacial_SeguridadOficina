from pydantic import BaseModel

class OfficeResponse(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True

class OfficeCreate(BaseModel):
    name: str
    description: str | None = None

class OfficeUpdate(BaseModel):
    name: str | None = None
    description: str | None = None