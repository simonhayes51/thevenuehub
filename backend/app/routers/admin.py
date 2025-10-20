from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import SessionLocal
from ..models import Act, Venue, Booking
from ..schemas import ActBase, ActOut, VenueBase, VenueOut, BookingOut, BookingBase
from ..security import require_admin

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------- ACTS --------
@router.get("/acts", response_model=List[ActOut])
def admin_list_acts(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Act).all()

@router.post("/acts", response_model=ActOut)
def admin_create_act(body: ActBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    act = Act(**body.dict())
    db.add(act)
    db.commit()
    db.refresh(act)
    return act

@router.put("/acts/{act_id}", response_model=ActOut)
def admin_update_act(act_id: int, body: ActBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    act = db.query(Act).get(act_id)
    if not act:
        raise HTTPException(status_code=404, detail="Act not found")
    for k, v in body.dict().items():
        setattr(act, k, v)
    db.commit()
    db.refresh(act)
    return act

@router.delete("/acts/{act_id}")
def admin_delete_act(act_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    act = db.query(Act).get(act_id)
    if not act:
        raise HTTPException(status_code=404, detail="Act not found")
    db.delete(act)
    db.commit()
    return {"ok": True}

# -------- VENUES --------
@router.get("/venues", response_model=List[VenueOut])
def admin_list_venues(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Venue).all()

@router.post("/venues", response_model=VenueOut)
def admin_create_venue(body: VenueBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    venue = Venue(**body.dict())
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue

@router.put("/venues/{venue_id}", response_model=VenueOut)
def admin_update_venue(venue_id: int, body: VenueBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    venue = db.query(Venue).get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    for k, v in body.dict().items():
        setattr(venue, k, v)
    db.commit()
    db.refresh(venue)
    return venue

@router.delete("/venues/{venue_id}")
def admin_delete_venue(venue_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    venue = db.query(Venue).get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    db.delete(venue)
    db.commit()
    return {"ok": True}

# -------- BOOKINGS --------
@router.get("/bookings", response_model=List[BookingOut])
def admin_list_bookings(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Booking).all()

@router.put("/bookings/{booking_id}", response_model=BookingOut)
def admin_update_booking(booking_id: int, body: BookingBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    b = db.query(Booking).get(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    for k, v in body.dict().items():
        setattr(b, k, v)
    db.commit()
    db.refresh(b)
    return b

@router.delete("/bookings/{booking_id}")
def admin_delete_booking(booking_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    b = db.query(Booking).get(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(b)
    db.commit()
    return {"ok": True}
