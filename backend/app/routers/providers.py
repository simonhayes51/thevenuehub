from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Act, Venue

router = APIRouter(tags=["providers"])

@router.post("/providers/register")
def providers_register(payload: dict, db: Session = Depends(get_db)):
    t = (payload.get("type") or "act").lower()
    if t == "venue":
        v = Venue(
            name=payload.get("name"),
            location=payload.get("location"),
            price_from=payload.get("price_from"),
            image_url=payload.get("image_url"),
            capacity=payload.get("capacity"),
        )
        db.add(v); db.commit(); db.refresh(v)
        return {"id": v.id, "type": "venue"}
    else:
        a = Act(
            name=payload.get("name"),
            location=payload.get("location"),
            genre=payload.get("genre") or payload.get("services"),
            price_from=payload.get("price_from"),
            image_url=payload.get("image_url"),
        )
        db.add(a); db.commit(); db.refresh(a)
        return {"id": a.id, "type": "act"}
