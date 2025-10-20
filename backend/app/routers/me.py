from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import User, Provider, Act, Package, Media, Availability
from ..schemas import ProviderIn, ProviderOut, PackageIn, MediaIn, AvailabilityIn, ActBase, ActOut
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
@router.get("/me/provider", response_model=ProviderOut)
def get_provider(user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Provider).filter_by(user_id=user.id).first()
    if not p: raise HTTPException(404, "Provider not found")
    return p
@router.post("/me/provider", response_model=ProviderOut)
def upsert_provider(body: ProviderIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Provider).filter_by(user_id=user.id).first()
    if not p:
        p = Provider(user_id=user.id, **body.dict(), status="pending")
        db.add(p)
    else:
        for k,v in body.dict().items(): setattr(p,k,v)
    db.commit(); db.refresh(p); return p
@router.post("/me/acts", response_model=ActOut)
def create_act(body: ActBase, user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = Act(**body.dict()); db.add(a); db.commit(); db.refresh(a); return a
@router.post("/me/packages")
def add_package(body: PackageIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = Package(**body.dict()); db.add(p); db.commit(); return {"ok": True}
@router.post("/me/media")
def add_media(body: MediaIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    m = Media(**body.dict()); db.add(m); db.commit(); return {"ok": True}
@router.post("/me/availability")
def add_availability(body: AvailabilityIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = Availability(**body.dict()); db.add(a); db.commit(); return {"ok": True}