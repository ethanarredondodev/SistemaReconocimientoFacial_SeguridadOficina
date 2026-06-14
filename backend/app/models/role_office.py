from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class RoleOffice(Base):
    __tablename__ = 'role_offices'

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    office_id = Column(Integer, ForeignKey("offices.id"), nullable=False)

    role = relationship("Role", back_populates="role_offices")
    office = relationship("Office", back_populates="role_offices")