from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import SessionLocal
from ..models import Act, Venue, Booking, Review, Provider, Business
from ..schemas import ActBase, ActOut, VenueBase, VenueOut, BookingOut, ReviewOut
from ..security import require_admin
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.get("/acts", response_model=List[ActOut])
def admin_list_acts(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Act).all()
@router.post("/acts", response_model=ActOut)
def admin_create_act(body: ActBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    a = Act(**body.dict()); db.add(a); db.commit(); db.refresh(a); return a
@router.put("/acts/{act_id}", response_model=ActOut)
def admin_update_act(act_id: int, body: ActBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    a = db.query(Act).get(act_id); 
    if not a: raise HTTPException(404, "Act not found")
    for k,v in body.dict().items(): setattr(a,k,v)
    db.commit(); db.refresh(a); return a
@router.delete("/acts/{act_id}")
def admin_delete_act(act_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    a = db.query(Act).get(act_id)
    if not a: raise HTTPException(404, "Act not found")
    db.delete(a); db.commit(); return {"ok": True}
@router.get("/venues", response_model=List[VenueOut])
def admin_list_venues(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Venue).all()
@router.post("/venues", response_model=VenueOut)
def admin_create_venue(body: VenueBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    v = Venue(**body.dict()); db.add(v); db.commit(); db.refresh(v); return v
@router.put("/venues/{venue_id}", response_model=VenueOut)
def admin_update_venue(venue_id: int, body: VenueBase, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    v = db.query(Venue).get(venue_id)
    if not v: raise HTTPException(404, "Venue not found")
    for k,vv in body.dict().items(): setattr(v,k,vv)
    db.commit(); db.refresh(v); return v
@router.delete("/venues/{venue_id}")
def admin_delete_venue(venue_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    v = db.query(Venue).get(venue_id)
    if not v: raise HTTPException(404, "Venue not found")
    db.delete(v); db.commit(); return {"ok": True}
@router.get("/bookings", response_model=List[BookingOut])
def admin_list_bookings(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Booking).all()
@router.get("/reviews", response_model=List[ReviewOut])
def admin_list_reviews(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Review).all()
@router.put("/reviews/{rid}")
def admin_update_review(rid: int, status: str = "visible", response: str = "", _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    r = db.query(Review).get(rid)
    if not r: raise HTTPException(404, "Review not found")
    r.status = status; r.response = response; db.commit(); return {"ok": True}
@router.delete("/reviews/{rid}")
def admin_delete_review(rid: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    r = db.query(Review).get(rid)
    if not r: raise HTTPException(404, "Review not found")
    db.delete(r); db.commit(); return {"ok": True}
@router.get("/providers/pending")
def admin_pending_providers(_: dict = Depends(require_admin), db: Session = Depends(get_db)):
    return [{"id":p.id,"display_name":p.display_name,"status":p.status} for p in db.query(Provider).filter_by(status="pending").all()]
@router.post("/providers/{pid}/approve")
def admin_approve_provider(pid: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    p = db.query(Provider).get(pid)
    if not p: raise HTTPException(404, "Provider not found")
    p.status = "approved"; db.commit(); return {"ok": True}
@router.post("/business/{bid}/grant-credits")
def admin_grant_credits(bid: int, credits: int = 5, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    b = db.query(Business).get(bid)
    if not b: raise HTTPException(404, "Business not found")
    b.lead_credits += credits; db.commit(); return {"ok": True}