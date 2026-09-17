import os

from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.role import Role
from app.models.user import User
import app.models
from app.core.security import hash_password

load_dotenv()


def seed_admin():
    db: Session = SessionLocal()

    try:
        admin_email = os.getenv("INITIAL_ADMIN_EMAIL")
        admin_password = os.getenv("INITIAL_ADMIN_PASSWORD")

        if not admin_email or not admin_password:
            raise ValueError(
                "INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD "
                "must be configured"
            )

        # Buscar el rol administrador
        admin_role = db.query(Role).filter(
            Role.name == "admin"
        ).first()

        # Crear el rol si todavía no existe
        if not admin_role:
            admin_role = Role(
                name="admin",
                description="System administrator",
                is_active=True
            )

            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        # Verificar si el administrador ya existe
        existing_admin = db.query(User).filter(
            User.email == admin_email
        ).first()

        if existing_admin:
            print("Admin user already exists.")
            return

        # Crear administrador inicial
        admin = User(
            full_name="System Administrator",
            email=admin_email,
            password=hash_password(admin_password),
            role_id=admin_role.id,
            face_image=None,
            is_active=True
        )

        db.add(admin)
        db.commit()

        print("Initial admin created successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()