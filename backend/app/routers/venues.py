from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db import SessionLocal
from ..models import Venue
from ..schemas import VenueOut
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.get("/venues", response_model=List[VenueOut])
def list_venues(q: Optional[str] = None, location: Optional[str] = None, style: Optional[str] = None, min_price: Optional[float] = Query(None, ge=0), max_price: Optional[float] = Query(None, ge=0), db: Session = Depends(get_db)):
    query = db.query(Venue)
    if q: query = query.filter(Venue.name.ilike(f"%{q}%") | Venue.amenities.ilike(f"%{q}%"))
    if location: query = query.filter(Venue.location.ilike(f"%{location}%"))
    if style: query = query.filter(Venue.style == style)
    if min_price is not None: query = query.filter(Venue.price_from >= min_price)
    if max_price is not None: query = query.filter(Venue.price_from <= max_price)
    return query.order_by(Venue.premium.desc(), Venue.featured.desc(), Venue.price_from.asc().nullslast()).all()
@router.get("/venues/{slug}", response_model=VenueOut)
def get_venue(slug: str, db: Session = Depends(get_db)):
    v = db.query(Venue).filter(Venue.slug == slug).first()
    if not v: raise HTTPException(404, "Venue not found")
    return v