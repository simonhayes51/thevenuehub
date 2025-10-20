from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import Act, Venue

router = APIRouter(tags=["public"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _act_to_dict(a: Act):
    if a is None:
        return None
    return {
        "id": a.id,
        "slug": getattr(a, "slug", None),
        "name": getattr(a, "name", None),
        "act_type": getattr(a, "act_type", None),
        "location": getattr(a, "location", None),
        "price_from": getattr(a, "price_from", None),
        "rating": getattr(a, "rating", None),
        "genres": getattr(a, "genres", None),
        "image_url": getattr(a, "image_url", None),
        "video_url": getattr(a, "video_url", None),
        "description": getattr(a, "description", None),
        "featured": getattr(a, "featured", False),
        "premium": getattr(a, "premium", False),
    }

def _venue_to_dict(v: Venue):
    if v is None:
        return None
    return {
        "id": v.id,
        "slug": getattr(v, "slug", None),
        "name": getattr(v, "name", None),
        "location": getattr(v, "location", None),
        "capacity": getattr(v, "capacity", None),
        "price_from": getattr(v, "price_from", None),
        "style": getattr(v, "style", None),
        "image_url": getattr(v, "image_url", None),
        "amenities": getattr(v, "amenities", None),
        "featured": getattr(v, "featured", False),
        "premium": getattr(v, "premium", False),
    }

@router.get("/acts")
def list_acts(db: Session = Depends(get_db)):
    rows = db.query(Act).order_by(Act.premium.desc(), Act.featured.desc(), Act.id.desc()).all()
    return [_act_to_dict(a) for a in rows]

@router.get("/acts/{act_id}")
def get_act_by_id(act_id: int, db: Session = Depends(get_db)):
    a = db.query(Act).filter(Act.id == act_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Act not found")
    return _act_to_dict(a)

@router.get("/venues")
def list_venues(db: Session = Depends(get_db)):
    rows = db.query(Venue).order_by(Venue.premium.desc(), Venue.featured.desc(), Venue.id.desc()).all()
    return [_venue_to_dict(v) for v in rows]

@router.get("/venues/{venue_id}")
def get_venue_by_id(venue_id: int, db: Session = Depends(get_db)):
    v = db.query(Venue).filter(Venue.id == venue_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Venue not found")
    return _venue_to_dict(v)
