from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class AccessLog(Base):
    __tablename__ = 'access_logs'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    office_id = Column(Integer, ForeignKey("offices.id"), nullable=False)
    access_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    access_time = Column(DateTime, default=datetime.utcnow)