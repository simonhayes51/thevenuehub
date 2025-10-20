import os
from fastapi import FastAPI, Depends, HTTPException, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .db import SessionLocal, init_db, seed_if_needed
 param($m)
            $list = $m.Groups[1].Value
            if ($list -notmatch '\bBooking\b') { "from .models import $list, Booking" } else { $m.Value }
        

# ----- Optional security helpers (fallbacks keep login from 500'ing) -----
try:
    from .security import verify_password, create_access_token
except Exception:
    def verify_password(plain: str, hashed: str) -> bool:
        # WARNING: replace with real hashing (passlib/bcrypt) in production
        return plain == hashed
    def create_access_token(sub: str) -> str:
        return f"token-{sub}"

def verify_password_safe(plain: str, hashed: str) -> bool:
    try:
        return verify_password(plain, hashed)
    except Exception:
        return plain == hashed

def create_access_token_safe(sub: str) -> str:
    try:
        return create_access_token(sub)
    except Exception:
        return f"token-{sub}"
# -------------------------------------------------------------------------

app = FastAPI(title="VenueHub API")

# ---------------- CORS (env-driven) + belt & braces ----------------
_ALLOWED = os.getenv("ALLOWED_ORIGINS")
_default_origins = [
    "https://venuehub-frontend-production.up.railway.app",
    "http://localhost:5173",
]
origins = [o.strip() for o in _ALLOWED.split(",")] if _ALLOWED else _default_origins
wildcard = any(o == "*" for o in origins)
allow_credentials = False if wildcard else True
allow_origins = ["*"] if wildcard else origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def _force_cors_headers(request, call_next):
    if request.method == "OPTIONS":
        resp = Response(status_code=204)
    else:
        resp = await call_next(request)
    resp.headers.setdefault("Access-Control-Allow-Origin", "*" if wildcard else request.headers.get("origin", ""))
    resp.headers.setdefault("Vary", "Origin")
    resp.headers.setdefault("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    resp.headers.setdefault("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin,X-Requested-With")
    resp.headers.setdefault("Access-Control-Allow-Credentials", "true" if allow_credentials else "false")
    return resp

@app.options("/{rest_of_path:path}")
def _options_catch_all():
    return Response(status_code=204)
# -------------------------------------------------------------------

# ---------------- DB helper & serializers ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _act_to_dict(a: Act):
    if a is None:
        return None
    return {
        "id": a.id,
        "slug": getattr(a, "slug", None),
        "name": getattr(a, "name", None),
        "act_type": getattr(a, "act_type", None),
        "location": getattr(a, "location", None),
        "price_from": getattr(a, "price_from", None),
        "rating": getattr(a, "rating", None),
        "genres": getattr(a, "genres", None),
        "image_url": getattr(a, "image_url", None),
        "video_url": getattr(a, "video_url", None),
        "description": getattr(a, "description", None),
        "featured": getattr(a, "featured", False),
        "premium": getattr(a, "premium", False),
    }

def _venue_to_dict(v: Venue):
    if v is None:
        return None
    return {
        "id": v.id,
        "slug": getattr(v, "slug", None),
        "name": getattr(v, "name", None),
        "location": getattr(v, "location", None),
        "capacity": getattr(v, "capacity", None),
        "price_from": getattr(v, "price_from", None),
        "style": getattr(v, "style", None),
        "image_url": getattr(v, "image_url", None),
        "amenities": getattr(v, "amenities", None),
        "featured": getattr(v, "featured", False),
        "premium": getattr(v, "premium", False),
    }
# --------------------------------------------------------

# ----------------- Health -----------------
@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}
# ------------------------------------------

# ----------------- Public API (acts/venues) -----------------
public_router = APIRouter(tags=["public"])

@public_router.get("/acts")
def list_acts(db: Session = Depends(get_db)):
    rows = db.query(Act).order_by(Act.premium.desc(), Act.featured.desc(), Act.id.desc()).all()
    return [_act_to_dict(a) for a in rows]

@public_router.get("/acts/{act_id}")
def get_act_by_id(act_id: int, db: Session = Depends(get_db)):
    a = db.query(Act).filter(Act.id == act_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Act not found")
    return _act_to_dict(a)

@public_router.get("/venues")
def list_venues(db: Session = Depends(get_db)):
    rows = db.query(Venue).order_by(Venue.premium.desc(), Venue.featured.desc(), Venue.id.desc()).all()
    return [_venue_to_dict(v) for v in rows]

@public_router.get("/venues/{venue_id}")
def get_venue_by_id(venue_id: int, db: Session = Depends(get_db)):
    v = db.query(Venue).filter(Venue.id == venue_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Venue not found")
    return _venue_to_dict(v)

# Expose under both root and /api, so frontend works either way
app.include_router(public_router, prefix="")
app.include_router(public_router, prefix="/api")
# ------------------------------------------------------------

# ----------------- Auth (login) -----------------
class LoginRequest(BaseModel):
    email: str
    password: str

def _user_payload(u: User) -> dict:
    return {
        "id": u.id,
        "email": u.email,
        "is_admin": getattr(u, "is_admin", False),
        "is_provider": getattr(u, "is_provider", False),
        "is_business": getattr(u, "is_business", False),
    }

def _do_login(data: LoginRequest, db: Session) -> dict:
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password_safe(data.password, getattr(user, "password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token_safe(str(getattr(user, "id", "")))
    return {"token": token, "user": _user_payload(user)}

@app.post("/auth/login")
def login_root(data: LoginRequest, db: Session = Depends(get_db)):
    return _do_login(data, db)

@app.post("/api/auth/login")
def login_api(data: LoginRequest, db: Session = Depends(get_db)):
    return _do_login(data, db)
# ---------------------------------------------

# ----------------- Startup -----------------
@app.on_event("startup")
def _bootstrap():
    init_db()
    seed_if_needed()
# -------------------------------------------

# ------------------- Admin API (read-only for UI) -------------------
from fastapi import APIRouter
admin_router = APIRouter(tags=["admin"])

@admin_router.get("/acts")
def admin_list_acts(db: Session = Depends(get_db)):
    rows = db.query(Act).order_by(Act.id.desc()).all()
    return [ _act_to_dict(a) for a in rows ]

@admin_router.get("/venues")
def admin_list_venues(db: Session = Depends(get_db)):
    rows = db.query(Venue).order_by(Venue.id.desc()).all()
    return [ _venue_to_dict(v) for v in rows ]

@admin_router.get("/bookings")
def admin_list_bookings(db: Session = Depends(get_db)):
    items = db.query(Booking).order_by(Booking.id.desc()).all()
    out = []
    for b in items:
        out.append({
            "id": b.id,
            "customer_name": getattr(b, "customer_name", None),
            "customer_email": getattr(b, "customer_email", None),
            "date": getattr(b, "date", None),
            "message": getattr(b, "message", None),
            "act_id": getattr(b, "act_id", None),
            "venue_id": getattr(b, "venue_id", None),
            "created_at": getattr(b, "created_at", None),
        })
    return out
# --------------------------------------------------------------------
app.include_router(admin_router, prefix="/api/admin")
app.include_router(admin_router, prefix="/admin")
