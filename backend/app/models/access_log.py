from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class AccessLog(Base):
    __tablename__ = 'access_logs'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    office_id = Column(Integer, ForeignKey("offices.id"), nullable=False)
    access_result = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    access_time = Column(DateTime, default=datetime.now)
    capture_image = Column(String, nullable=True)

    user = relationship("User", back_populates="access_logs")
    office = relationship("Office", back_populates="access_logs")