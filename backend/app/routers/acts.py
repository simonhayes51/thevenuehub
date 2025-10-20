from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db import SessionLocal
from ..models import Act
from ..schemas import ActOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/acts", response_model=List[ActOut])
def list_acts(db: Session = Depends(get_db)):
    return db.query(Act).order_by(Act.rating.desc().nullslast()).all()

@router.get("/acts/{act_id}", response_model=ActOut)
def get_act(act_id: int, db: Session = Depends(get_db)):
    return db.query(Act).get(act_id)
