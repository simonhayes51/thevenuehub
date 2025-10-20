from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import Booking, Lead
from ..schemas import BookingBase, BookingOut
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.post("/bookings", response_model=BookingOut)
def create_booking(payload: BookingBase, db: Session = Depends(get_db)):
    b = Booking(**payload.dict()); db.add(b); db.flush(); db.add(Lead(booking_id=b.id)); db.commit(); db.refresh(b); return b