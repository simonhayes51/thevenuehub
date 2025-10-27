from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Enquiry

router = APIRouter(tags=["admin"])

def require_admin(authorization: str = Header(default="")):
    # TODO: replace with your actual admin/session check
    return True

@router.get("/admin/leads")
def admin_leads(db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    rows = db.query(Enquiry).order_by(Enquiry.id.desc()).limit(200).all()
    return [ {"id":r.id,"customer_name":r.customer_name,"customer_email":r.customer_email,"date":r.date,"message":r.message,"act_id":r.act_id,"venue_id":r.venue_id} for r in rows ]
