from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Act, Venue

router = APIRouter(tags=["search"])

@router.get("/search")
def search(q: str = Query("", alias="q"), type: str = Query("all"), db: Session = Depends(get_db)):
    qs = f"%{q.lower()}%"
    acts, venues = [], []
    if type in ("all","acts"):
        acts = db.query(Act).filter(
            (Act.name.ilike(qs)) | (Act.location.ilike(qs)) | (Act.genre.ilike(qs))
        ).limit(48).all()
    if type in ("all","venues"):
        venues = db.query(Venue).filter(
            (Venue.name.ilike(qs)) | (Venue.location.ilike(qs))
        ).limit(48).all()
    def A(a): return {"id":a.id,"name":a.name,"location":a.location,"genre":getattr(a,"genre",None),
                      "price_from":getattr(a,"price_from",None),"image_url":getattr(a,"image_url",None),"rating":getattr(a,"rating",None)}
    def V(v): return {"id":v.id,"name":v.name,"location":v.location,"capacity":getattr(v,"capacity",None),
                      "price_from":getattr(v,"price_from",None),"image_url":getattr(v,"image_url",None)}
    return {"acts":[A(a) for a in acts], "venues":[V(v) for v in venues]}
