from pydantic import BaseModel

class RoleResponse(BaseModel):
    id: int
    name: str
    is_active: bool
    description: str | None = None

    class Config:
        from_attributes = True

class RoleCreate(BaseModel):
    name: str
    description: str | None = None

class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None