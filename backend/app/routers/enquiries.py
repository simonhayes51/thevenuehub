from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Enquiry

router = APIRouter(tags=["enquiries"])

@router.post("/enquiries")
def create_enquiry(payload: dict, db: Session = Depends(get_db)):
    data = {
        "customer_name": payload.get("name"),
        "customer_email": payload.get("email"),
        "date": payload.get("date"),
        "message": payload.get("message"),
        "act_id": payload.get("act_id"),
        "venue_id": payload.get("venue_id"),
    }
    e = Enquiry(**data)
    db.add(e)
    db.commit()
    db.refresh(e)
    return {"id": e.id}
