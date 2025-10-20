from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import User, Business, Booking, Lead
from ..security import bearer, SECRET_KEY, jwt
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
def current_user(creds=Depends(bearer), db: Session = Depends(get_db)) -> User:
    if not creds: raise HTTPException(401, "Not authenticated")
    payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=["HS256"])
    u = db.query(User).filter_by(email=payload["sub"]).first()
    if not u: raise HTTPException(401, "User not found")
    return u
@router.get("/business/leads")
def list_leads(user: User = Depends(current_user), db: Session = Depends(get_db)):
    biz = db.query(Business).filter_by(user_id=user.id).first()
    leads = db.query(Lead).all(); result=[]
    for l in leads:
        b = db.query(Booking).get(l.booking_id)
        redacted_email = b.customer_email if l.unlocked_by_business_id == biz.id else "unlock to view"
        result.append({"lead_id":l.id,"booking_id":b.id,"date":b.date,"act_id":b.act_id,"venue_id":b.venue_id,"customer_name":b.customer_name,"customer_email":redacted_email,"message":b.message,"unlocked":l.unlocked_by_business_id==biz.id})
    return {"credits": biz.lead_credits, "items": result}
@router.post("/business/leads/{lead_id}/unlock")
def unlock_lead(lead_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    biz = db.query(Business).filter_by(user_id=user.id).first()
    if biz.lead_credits <= 0: raise HTTPException(402, "No credits. Upgrade to Pro to unlock more.")
    l = db.query(Lead).get(lead_id)
    if not l: raise HTTPException(404, "Lead not found")
    l.unlocked_by_business_id = biz.id; biz.lead_credits -= 1; db.commit(); return {"ok": True, "credits": biz.lead_credits}