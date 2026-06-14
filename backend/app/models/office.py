from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Office(Base):
    __tablename__ = 'offices'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, server_default='true')

    role_offices = relationship("RoleOffice", back_populates="office")
    user_offices = relationship("UserOffice", back_populates="office")
    access_logs = relationship("AccessLog", back_populates="office")
