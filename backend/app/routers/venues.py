from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db import SessionLocal
from ..models import Venue
from ..schemas import VenueOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/venues", response_model=List[VenueOut])
def list_venues(db: Session = Depends(get_db)):
    return db.query(Venue).order_by(Venue.price_from.asc().nullslast()).all()

@router.get("/venues/{venue_id}", response_model=VenueOut)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    return db.query(Venue).get(venue_id)
