import os, json
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel

from .db import SessionLocal, init_db, seed_if_needed
from .models import Act, Venue, User, Booking

# ---------- Security helpers (fallbacks prevent 500s) ----------
try:
    from .security import verify_password, create_access_token
except Exception:
    def verify_password(plain: str, hashed: str) -> bool:
        # WARNING: replace with real hashing in production
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
# --------------------------------------------------------------

app = FastAPI(title="VenueHub API")

# -------------------- CORS (env-driven) ----------------------
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
# -------------------------------------------------------------


# ----------------- DB helper & serializers -------------------
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
# -------------------------------------------------------------


# ------------------------ Health -----------------------------
@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}
# -------------------------------------------------------------


# ------------------- Public API (acts/venues) ----------------
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

# Expose under both root and /api
app.include_router(public_router, prefix="")
app.include_router(public_router, prefix="/api")
# -------------------------------------------------------------


# ----------------------- Admin (lists) -----------------------
admin_router = APIRouter(tags=["admin"])

@admin_router.get("/acts")
def admin_list_acts(db: Session = Depends(get_db)):
    rows = db.query(Act).order_by(Act.id.desc()).all()
    return [_act_to_dict(a) for a in rows]

@admin_router.get("/venues")
def admin_list_venues(db: Session = Depends(get_db)):
    rows = db.query(Venue).order_by(Venue.id.desc()).all()
    return [_venue_to_dict(v) for v in rows]

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

app.include_router(admin_router, prefix="/api/admin")
app.include_router(admin_router, prefix="/admin")
# -------------------------------------------------------------


# ------------------------ Auth/Login -------------------------
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
# -------------------------------------------------------------


# ---------------- Reviews (public + admin) -------------------
# Tables created on startup (see _ensure_aux_tables).
class ReviewIn(BaseModel):
    rating: int
    comment: str
    author_name: str | None = None
    act_id: int | None = None
    venue_id: int | None = None

@app.get("/api/reviews")
def list_reviews(act_id: int | None = None, venue_id: int | None = None, db: Session = Depends(get_db)):
    # Only approved reviews (status='approved')
    where = []
    params = {}
    if act_id: 
        where.append("act_id = :aid"); params["aid"] = act_id
    if venue_id: 
        where.append("venue_id = :vid"); params["vid"] = venue_id
    where.append("status = 'approved'")
    sql = "SELECT id, rating, comment, author_name, act_id, venue_id, created_at FROM reviews"
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY id DESC LIMIT 200"
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]

@app.post("/api/reviews")
def create_review(data: ReviewIn, db: Session = Depends(get_db)):
    if not data.act_id and not data.venue_id:
        raise HTTPException(status_code=400, detail="Provide act_id or venue_id")
    params = {
        "rating": max(1, min(5, data.rating or 0)),
        "comment": data.comment or "",
        "author_name": data.author_name or "Anonymous",
        "act_id": data.act_id,
        "venue_id": data.venue_id,
        "status": "pending",
    }
    db.execute(text("""
        INSERT INTO reviews (rating, comment, author_name, act_id, venue_id, status, created_at)
        VALUES (:rating, :comment, :author_name, :act_id, :venue_id, :status, NOW())
    """), params)
    db.commit()
    return {"ok": True, "status": "pending"}

@app.get("/api/admin/reviews")
def admin_list_reviews(status: str | None = None, db: Session = Depends(get_db)):
    sql = "SELECT id, rating, comment, author_name, act_id, venue_id, status, created_at FROM reviews"
    params = {}
    if status:
        sql += " WHERE status = :st"
        params["st"] = status
    sql += " ORDER BY id DESC LIMIT 500"
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]

@app.patch("/api/admin/reviews/{rid}")
def admin_update_review(rid: int, status: str, db: Session = Depends(get_db)):
    if status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="status must be approved|rejected")
    db.execute(text("UPDATE reviews SET status=:st WHERE id=:rid"), {"st": status, "rid": rid})
    db.commit()
    return {"ok": True}
# -------------------------------------------------------------


# ---------------- Providers (submissions) --------------------
class SubmissionIn(BaseModel):
    role: str  # "act" or "venue"
    name: str
    location: str | None = None
    price_from: float | None = None
    genres: str | None = None       # acts
    description: str | None = None
    capacity: int | None = None     # venues
    style: str | None = None        # venues

@app.post("/api/providers/acts")
def submit_act(data: SubmissionIn, db: Session = Depends(get_db)):
    payload = data.model_dump()
    payload["role"] = "act"
    db.execute(text("""
        INSERT INTO submissions (role, payload_json, status, created_at)
        VALUES ('act', :payload, 'pending', NOW())
    """), {"payload": json.dumps(payload)})
    db.commit()
    return {"ok": True, "status": "pending"}

@app.post("/api/providers/venues")
def submit_venue(data: SubmissionIn, db: Session = Depends(get_db)):
    payload = data.model_dump()
    payload["role"] = "venue"
    db.execute(text("""
        INSERT INTO submissions (role, payload_json, status, created_at)
        VALUES ('venue', :payload, 'pending', NOW())
    """), {"payload": json.dumps(payload)})
    db.commit()
    return {"ok": True, "status": "pending"}

@app.get("/api/admin/submissions")
def admin_list_submissions(status: str | None = None, db: Session = Depends(get_db)):
    sql = "SELECT id, role, payload_json, status, created_at FROM submissions"
    params = {}
    if status:
        sql += " WHERE status = :st"
        params["st"] = status
    sql += " ORDER BY id DESC LIMIT 500"
    rows = db.execute(text(sql), params).mappings().all()
    # parse JSON
    out = []
    for r in rows:
        d = dict(r)
        try:
            d["payload"] = json.loads(d.pop("payload_json") or "{}")
        except Exception:
            d["payload"] = {}
        out.append(d)
    return out

@app.post("/api/admin/submissions/{sid}/approve")
def admin_approve_submission(sid: int, db: Session = Depends(get_db)):
    row = db.execute(text("SELECT id, role, payload_json FROM submissions WHERE id=:sid"), {"sid": sid}).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")
    payload = json.loads(row["payload_json"] or "{}")
    role = (row["role"] or "").lower()
    if role == "act":
        a = Act(
            name=payload.get("name"),
            location=payload.get("location"),
            price_from=payload.get("price_from"),
            genres=payload.get("genres"),
            description=payload.get("description"),
            act_type=payload.get("act_type") or "Act",
            featured=False, premium=False, rating=4.8,
        )
        db.add(a); db.flush()
    elif role == "venue":
        v = Venue(
            name=payload.get("name"),
            location=payload.get("location"),
            capacity=payload.get("capacity"),
            price_from=payload.get("price_from"),
            style=payload.get("style"),
            amenities=payload.get("amenities"),
            description=payload.get("description"),
            featured=False, premium=False,
        )
        db.add(v); db.flush()
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    db.execute(text("UPDATE submissions SET status='approved' WHERE id=:sid"), {"sid": sid})
    db.commit()
    return {"ok": True, "published_id": (locals().get("a").id if role=="act" else locals().get("v").id)}

# ----------------------- Startup hook ------------------------
def _ensure_aux_tables():
    # Minimal tables with IF NOT EXISTS (no external migrations needed)
    with SessionLocal() as db:
        db.execute(text("""
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            author_name VARCHAR(200),
            act_id INTEGER,
            venue_id INTEGER,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
        """))
        db.execute(text("""
        CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            role VARCHAR(20) NOT NULL,         -- 'act' or 'venue'
            payload_json TEXT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
        """))
        db.commit()

@app.on_event("startup")
def _bootstrap():
    init_db()
    _ensure_aux_tables()
    seed_if_needed()
# -------------------------------------------------------------
