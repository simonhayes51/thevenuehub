from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db import SessionLocal
from ..models import Act
from ..schemas import ActOut
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.get("/acts", response_model=List[ActOut])
def list_acts(q: Optional[str] = None, location: Optional[str] = None, act_type: Optional[str] = None, genre: Optional[str] = None, min_price: Optional[float] = Query(None, ge=0), max_price: Optional[float] = Query(None, ge=0), db: Session = Depends(get_db)):
    query = db.query(Act)
    if q: query = query.filter(Act.name.ilike(f"%{q}%") | Act.description.ilike(f"%{q}%"))
    if location: query = query.filter(Act.location.ilike(f"%{location}%"))
    if act_type: query = query.filter(Act.act_type == act_type)
    if genre: query = query.filter(Act.genres.ilike(f"%{genre}%"))
    if min_price is not None: query = query.filter(Act.price_from >= min_price)
    if max_price is not None: query = query.filter(Act.price_from <= max_price)
    return query.order_by(Act.premium.desc(), Act.featured.desc(), Act.rating.desc().nullslast()).all()
@router.get("/acts/{slug}", response_model=ActOut)
def get_act(slug: str, db: Session = Depends(get_db)):
    a = db.query(Act).filter(Act.slug == slug).first()
    if not a: raise HTTPException(404, "Act not found")
    return a