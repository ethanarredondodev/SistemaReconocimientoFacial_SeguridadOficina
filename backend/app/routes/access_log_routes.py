from datetime import datetime, time, timedelta, date
from operator import or_
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.auth import get_current_user
from app.models.access_log import AccessLog
from app.schemas.access_log_schema import AccessLogResponse
from app.database import get_db
from sqlalchemy.orm import Session  

from app.models.user import User
from app.core.permissions import require_admin

router = APIRouter(
    prefix="/access-logs",
    tags=["Access Logs"]
)

@router.get("/", response_model=list[AccessLogResponse])
def get_access_logs(
    user_id: List[int] | None = Query(default=None),  # ← lista
    include_unknown: bool = False,
    office_id: List[int] | None = Query(default=None),  # ← lista
    result: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    query = db.query(AccessLog)

    if user_id is not None and include_unknown:
        query = query.filter(
            or_(
                (AccessLog.user_id.in_(user_id)),
                (AccessLog.user_id.is_(None))
            )            
        )
    elif user_id is not None:
        query = query.filter(AccessLog.user_id.in_(user_id))
    elif include_unknown:
        query = query.filter(AccessLog.user_id.is_(None))

    if office_id is not None:
        query = query.filter(AccessLog.office_id.in_(office_id))
    if result is not None:
        query = query.filter(AccessLog.access_result == result)
    if start_date is not None:
        query = query.filter(AccessLog.access_time >= start_date)
    if end_date is not None:
        query = query.filter(
            AccessLog.access_time < datetime.combine(end_date + timedelta(days=1), time.min)
        )

    query = query.order_by(AccessLog.access_time.desc())
    return query.all()


@router.get("/me", response_model=list[AccessLogResponse])
def get_my_access_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    access_logs = db.query(AccessLog).filter(
        AccessLog.user_id == current_user.id
    ).order_by(
        AccessLog.access_time.desc()
    ).all()
    return access_logs


@router.get("/{access_log_id}", response_model=AccessLogResponse)
def get_access_log(access_log_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    access_log = db.query(AccessLog).filter(
        AccessLog.id == access_log_id
    ).first()
    if not access_log:
        raise HTTPException(
            status_code=404, 
            detail="Access log not found"
        )
    
    return access_log

''' 
@router.get("/user/{user_id}", response_model=list[AccessLogResponse])
def get_access_logs_by_user(user_id: int, db: Session = Depends(get_db)):
    access_logs = db.query(AccessLog).filter(
        AccessLog.user_id == user_id
    ).all()
    return access_logs


@router.get("/office/{office_id}", response_model=list[AccessLogResponse])
def get_access_logs_by_office(office_id: int, db: Session = Depends(get_db)):
    access_logs = db.query(AccessLog).filter(
        AccessLog.office_id == office_id
    ).all()
    return access_logs

@router.get("/granted", response_model=list[AccessLogResponse])
def get_granted_access_logs(db: Session = Depends(get_db)):
    access_logs = db.query(AccessLog).filter(
        AccessLog.access_result == "Permitido"
    ).all()
    return access_logs

@router.get("/denied", response_model=list[AccessLogResponse])
def get_denied_access_logs(db: Session = Depends(get_db)):
    access_logs = db.query(AccessLog).filter(
        AccessLog.access_result == "Denegado"
    ).all()
    return access_logs
'''