from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User
from app.models.role import Role
from app.models.office import Office
from app.models.role_office import RoleOffice
from app.models.user_office import UserOffice
from app.models.access_log import AccessLog

from app.routes.user_routes import router as user_router
from app.routes.auth_routes import router as auth_router
from app.routes.role_routes import router as role_router
from app.routes.office_routes import router as office_router

app = FastAPI(
    title="COMPRAFACIL ACCESS API",
    version="1.0.0"
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(role_router)
app.include_router(office_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to COMPRAFACIL ACCESS API!"
    }