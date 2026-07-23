from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from app.database import get_db
from app.models.user import User
from app.models.office import Office
from app.models.access_log import AccessLog
from app.core.permissions import require_admin
from sqlalchemy import func

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

@router.get("/weekly-stats")
def get_weekly_stats(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    today = datetime.now().date()
    week_ago = today - timedelta(days=6)

    stats = []

    for i in range(7):
        day = week_ago + timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())

        permitted = db.query(AccessLog).filter(
            AccessLog.access_time >= day_start,
            AccessLog.access_time <= day_end,
            AccessLog.access_result == "PERMITIDO"
        ).count()

        denied = db.query(AccessLog).filter(
            AccessLog.access_time >= day_start,
            AccessLog.access_time <= day_end,
            AccessLog.access_result == "DENEGADO"
        ).count()

        stats.append({
            "day": day.strftime("%a"),  # Lun, Mar, Mie...
            "date": day.strftime("%d/%m"),
            "permitted": permitted,
            "denied": denied
        })

    return stats

@router.get("/top-offices")
def get_top_offices(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    offices = db.query(
        Office.name,
        func.count(AccessLog.id).label("total")
    ).join(AccessLog, AccessLog.office_id == Office.id)\
     .filter(Office.is_active == True)\
     .group_by(Office.name)\
     .order_by(func.count(AccessLog.id).desc())\
     .limit(5).all()

    return [{"name": o.name, "total": o.total} for o in offices]


@router.get("/top-users")
def get_top_users(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    users = db.query(
        User.full_name,
        func.count(AccessLog.id).label("total")
    ).join(AccessLog, AccessLog.user_id == User.id)\
     .filter(User.is_active == True)\
     .group_by(User.full_name)\
     .order_by(func.count(AccessLog.id).desc())\
     .limit(5).all()

    return [{"name": u.full_name, "total": u.total} for u in users]