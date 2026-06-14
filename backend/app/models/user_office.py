from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class UserOffice(Base):
    __tablename__ = 'user_offices'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    office_id = Column(Integer, ForeignKey("offices.id"), nullable=False)

    user = relationship("User", back_populates="user_offices")
    office = relationship("Office", back_populates="user_offices")