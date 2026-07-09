from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date
from app.database import get_db
from app.models.user import User
from app.models.office import Office
from app.models.access_log import AccessLog
from app.core.permissions import require_admin

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    today = date.today()

    total_users = db.query(User).filter(User.is_active == True).count()
    total_offices = db.query(Office).filter(Office.is_active == True).count()
    
    accesses_today = db.query(AccessLog).filter(
        AccessLog.access_time >= datetime.combine(today, datetime.min.time())
    ).count()
    
    denied_today = db.query(AccessLog).filter(
        AccessLog.access_time >= datetime.combine(today, datetime.min.time()),
        AccessLog.access_result == "DENEGADO"
    ).count()

    recent_logs = db.query(AccessLog).order_by(
        AccessLog.access_time.desc()
    ).limit(10).all()

    return {
        "total_users": total_users,
        "total_offices": total_offices,
        "accesses_today": accesses_today,
        "denied_today": denied_today,
        "recent_logs": [
            {
                "id": log.id,
                "user": log.user.full_name if log.user else "Desconocido",
                "office": log.office.name if log.office else "-",
                "access_result": log.access_result,
                "confidence": log.confidence,
                "access_time": log.access_time.strftime("%H:%M")
            }
            for log in recent_logs
        ]
    }