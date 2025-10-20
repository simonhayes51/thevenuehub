from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from ..db import SessionLocal
from ..models import Review
from ..schemas import ReviewBase, ReviewOut
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.get("/reviews", response_model=list[ReviewOut])
def list_reviews(act_id: Optional[int] = None, venue_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Review).filter(Review.status=="visible")
    if act_id: q = q.filter(Review.act_id==act_id)
    if venue_id: q = q.filter(Review.venue_id==venue_id)
    return q.order_by(Review.id.desc()).all()
@router.post("/reviews", response_model=ReviewOut)
def create_review(body: ReviewBase, db: Session = Depends(get_db)):
    r = Review(**body.dict(), status="visible")
    db.add(r); db.commit(); db.refresh(r); return r