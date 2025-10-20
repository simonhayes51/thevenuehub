from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import User, Provider, Business
from ..schemas import LoginRequest, Token
from ..security import verify_password, get_password_hash, create_access_token
router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
@router.post("/login", response_model=Token)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    roles = {"admin": user.is_admin, "provider": user.is_provider, "business": user.is_business}
    token = create_access_token(sub=user.email, roles=roles)
    return {"access_token": token, "token_type": "bearer"}
@router.post("/register/provider", response_model=Token)
def register_provider(email: str, password: str, display_name: str, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(400, "Email exists")
    u = User(email=email, password_hash=get_password_hash(password), is_provider=True)
    db.add(u); db.flush()
    db.add(Provider(user_id=u.id, display_name=display_name, status="pending"))
    db.commit()
    token = create_access_token(sub=email, roles={"admin":False,"provider":True,"business":False})
    return {"access_token": token, "token_type": "bearer"}
@router.post("/register/business", response_model=Token)
def register_business(email: str, password: str, company: str, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(400, "Email exists")
    u = User(email=email, password_hash=get_password_hash(password), is_business=True)
    db.add(u); db.flush()
    db.add(Business(user_id=u.id, company=company, plan="free", lead_credits=3))
    db.commit()
    token = create_access_token(sub=email, roles={"admin":False,"provider":False,"business":True})
    return {"access_token": token, "token_type": "bearer"}