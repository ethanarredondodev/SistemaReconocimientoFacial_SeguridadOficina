from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

from app.routes.role_office_routes import router as role_office_router
from app.routes.user_office_routes import router as user_office_router
from app.routes.access_log_routes import router as access_log_router

from app.routes.dashboard_routes import router as dashboard_router
from app.routes.face_access_routes import router as face_access_router

app = FastAPI(
    title="COMPRAFACIL ACCESS API",
    version="1.0.0"
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(role_router)
app.include_router(office_router)
app.include_router(role_office_router)
app.include_router(user_office_router)
app.include_router(access_log_router)
app.include_router(face_access_router)
app.include_router(dashboard_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)


@app.get("/")
def root():
    return {
        "message": "Welcome to COMPRAFACIL ACCESS API!"
    }