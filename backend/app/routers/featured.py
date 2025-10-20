from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import Act, Venue
from ..schemas import ActOut, VenueOut
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.get("/featured/acts", response_model=list[ActOut])
def featured_acts(db: Session = Depends(get_db)):
    return db.query(Act).order_by(Act.premium.desc(), Act.featured.desc(), Act.rating.desc()).limit(8).all()
@router.get("/featured/venues", response_model=list[VenueOut])
def featured_venues(db: Session = Depends(get_db)):
    return db.query(Venue).order_by(Venue.premium.desc(), Venue.featured.desc(), Venue.price_from.asc()).limit(8).all()