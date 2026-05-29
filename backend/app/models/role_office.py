from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class RoleOffice(Base):
    __tablename__ = 'role_offices'

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    office_id = Column(Integer, ForeignKey("offices.id"), nullable=False)