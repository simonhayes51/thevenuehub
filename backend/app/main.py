import os, json
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from pydantic import BaseModel, EmailStr
from typing import Optional, List

from .db import SessionLocal, init_db
from .models import Act, Venue, User, Booking

# Security helpers with fallbacks
try:
    from .security import verify_password, create_access_token, get_password_hash
except Exception:
    def verify_password(plain: str, hashed: str) -> bool:
        return plain == hashed
    def create_access_token(sub: str) -> str:
        return f"token-{sub}"
    def get_password_hash(plain: str) -> str:
        return plain

app = FastAPI(title="VenueHub API", version="2.0.0")

# CORS Configuration
_ALLOWED = os.getenv("ALLOWED_ORIGINS", "")
_default_origins = [
    "https://venuehub-frontend-production.up.railway.app",
    "http://localhost:5173",
    "http://localhost:3000",
]
origins = [o.strip() for o in _ALLOWED.split(",")] if _ALLOWED else _default_origins
wildcard = any(o == "*" for o in origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if wildcard else origins,
    allow_credentials=False if wildcard else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def force_cors(request, call_next):
    if request.method == "OPTIONS":
        return Response(status_code=204, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Authorization,Content-Type,Accept",
        })
    resp = await call_next(request)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

# Database helper
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Serializers
def act_to_dict(a: Act):
    if not a:
        return None
    return {
        "id": a.id,
        "slug": getattr(a, "slug", f"act-{a.id}"),
        "name": getattr(a, "name", "Untitled Act"),
        "act_type": getattr(a, "act_type", "Entertainment"),
        "location": getattr(a, "location", ""),
        "price_from": getattr(a, "price_from", None),
        "rating": getattr(a, "rating", 5.0),
        "genres": getattr(a, "genres", ""),
        "image_url": getattr(a, "image_url", ""),
        "video_url": getattr(a, "video_url", ""),
        "description": getattr(a, "description", ""),
        "featured": getattr(a, "featured", False),
        "premium": getattr(a, "premium", False),
    }

def venue_to_dict(v: Venue):
    if not v:
        return None
    return {
        "id": v.id,
        "slug": getattr(v, "slug", f"venue-{v.id}"),
        "name": getattr(v, "name", "Untitled Venue"),
        "location": getattr(v, "location", ""),
        "capacity": getattr(v, "capacity", None),
        "price_from": getattr(v, "price_from", None),
        "style": getattr(v, "style", ""),
        "image_url": getattr(v, "image_url", ""),
        "amenities": getattr(v, "amenities", ""),
        "description": getattr(v, "description", ""),
        "featured": getattr(v, "featured", False),
        "premium": getattr(v, "premium", False),
    }

# Health Check
@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# Public Endpoints - Acts
@app.get("/acts")
@app.get("/api/acts")
def list_acts(
    q: Optional[str] = None,
    location: Optional[str] = None,
    genre: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Act)
    
    if q:
        search = f"%{q.lower()}%"
        query = query.filter(
            (func.lower(Act.name).like(search)) |
            (func.lower(Act.description).like(search)) |
            (func.lower(Act.genres).like(search))
        )
    
    if location:
        query = query.filter(func.lower(Act.location).like(f"%{location.lower()}%"))
    
    if genre:
        query = query.filter(func.lower(Act.genres).like(f"%{genre.lower()}%"))
    
    if min_price is not None:
        query = query.filter(Act.price_from >= min_price)
    
    if max_price is not None:
        query = query.filter(Act.price_from <= max_price)
    
    if featured is not None:
        query = query.filter(Act.featured == featured)
    
    rows = query.order_by(
        Act.premium.desc(),
        Act.featured.desc(),
        Act.rating.desc(),
        Act.id.desc()
    ).all()
    
    return [act_to_dict(a) for a in rows]

@app.get("/acts/{act_id}")
@app.get("/api/acts/{act_id}")
def get_act(act_id: int, db: Session = Depends(get_db)):
    a = db.query(Act).filter(Act.id == act_id).first()
    if not a:
        raise HTTPException(404, "Act not found")
    return act_to_dict(a)

# Public Endpoints - Venues
@app.get("/venues")
@app.get("/api/venues")
def list_venues(
    q: Optional[str] = None,
    location: Optional[str] = None,
    style: Optional[str] = None,
    min_capacity: Optional[int] = None,
    max_capacity: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Venue)
    
    if q:
        search = f"%{q.lower()}%"
        query = query.filter(
            (func.lower(Venue.name).like(search)) |
            (func.lower(Venue.description).like(search)) |
            (func.lower(Venue.amenities).like(search))
        )
    
    if location:
        query = query.filter(func.lower(Venue.location).like(f"%{location.lower()}%"))
    
    if style:
        query = query.filter(func.lower(Venue.style).like(f"%{style.lower()}%"))
    
    if min_capacity is not None:
        query = query.filter(Venue.capacity >= min_capacity)
    
    if max_capacity is not None:
        query = query.filter(Venue.capacity <= max_capacity)
    
    if min_price is not None:
        query = query.filter(Venue.price_from >= min_price)
    
    if max_price is not None:
        query = query.filter(Venue.price_from <= max_price)
    
    if featured is not None:
        query = query.filter(Venue.featured == featured)
    
    rows = query.order_by(
        Venue.premium.desc(),
        Venue.featured.desc(),
        Venue.id.desc()
    ).all()
    
    return [venue_to_dict(v) for v in rows]

@app.get("/venues/{venue_id}")
@app.get("/api/venues/{venue_id}")
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    v = db.query(Venue).filter(Venue.id == venue_id).first()
    if not v:
        raise HTTPException(404, "Venue not found")
    return venue_to_dict(v)

# Enquiries
class EnquiryRequest(BaseModel):
    name: str
    email: EmailStr
    date: Optional[str] = None
    message: Optional[str] = None
    act_id: Optional[int] = None
    venue_id: Optional[int] = None

@app.post("/enquiries")
@app.post("/api/enquiries")
def create_enquiry(data: EnquiryRequest, db: Session = Depends(get_db)):
    if not data.act_id and not data.venue_id:
        raise HTTPException(400, "Must specify act_id or venue_id")
    
    booking = Booking(
        customer_name=data.name,
        customer_email=data.email,
        date=data.date or "",
        message=data.message or "",
        act_id=data.act_id,
        venue_id=data.venue_id,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    return {"id": booking.id, "status": "received"}

# Reviews
class ReviewRequest(BaseModel):
    rating: int
    comment: str
    author_name: Optional[str] = "Anonymous"
    act_id: Optional[int] = None
    venue_id: Optional[int] = None

@app.get("/reviews")
@app.get("/api/reviews")
def list_reviews(
    act_id: Optional[int] = None,
    venue_id: Optional[int] = None,
    status: str = "approved",
    db: Session = Depends(get_db)
):
    sql = """
        SELECT id, rating, comment, author_name, act_id, venue_id, 
               status, created_at
        FROM reviews
        WHERE status = :status
    """
    params = {"status": status}
    
    if act_id:
        sql += " AND act_id = :act_id"
        params["act_id"] = act_id
    
    if venue_id:
        sql += " AND venue_id = :venue_id"
        params["venue_id"] = venue_id
    
    sql += " ORDER BY id DESC LIMIT 100"
    
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]

@app.post("/reviews")
@app.post("/api/reviews")
def create_review(data: ReviewRequest, db: Session = Depends(get_db)):
    if not data.act_id and not data.venue_id:
        raise HTTPException(400, "Must specify act_id or venue_id")
    
    db.execute(text("""
        INSERT INTO reviews (rating, comment, author_name, act_id, venue_id, status, created_at)
        VALUES (:rating, :comment, :author, :act_id, :venue_id, 'pending', NOW())
    """), {
        "rating": max(1, min(5, data.rating)),
        "comment": data.comment,
        "author": data.author_name,
        "act_id": data.act_id,
        "venue_id": data.venue_id,
    })
    db.commit()
    
    return {"status": "pending"}

# Provider Registration
class ProviderRegistration(BaseModel):
    type: str  # "act" or "venue"
    name: str
    email: EmailStr
    location: Optional[str] = None
    genre: Optional[str] = None
    genres: Optional[str] = None
    capacity: Optional[int] = None
    price_from: Optional[float] = None
    website: Optional[str] = None

@app.post("/providers/register")
@app.post("/api/providers/register")
def register_provider(data: ProviderRegistration, db: Session = Depends(get_db)):
    payload = data.model_dump()
    
    db.execute(text("""
        INSERT INTO submissions (role, payload_json, status, created_at)
        VALUES (:role, :payload, 'pending', NOW())
    """), {
        "role": data.type,
        "payload": json.dumps(payload),
    })
    db.commit()
    
    return {"status": "pending", "message": "Thanks! We'll review and contact you soon."}

# Auth
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@app.post("/auth/login")
@app.post("/api/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, getattr(user, "password_hash", "")):
        raise HTTPException(401, "Invalid credentials")
    
    token = create_access_token(str(user.id))
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "is_admin": getattr(user, "is_admin", False),
            "is_provider": getattr(user, "is_provider", False),
            "is_business": getattr(user, "is_business", False),
        }
    }

# Admin Endpoints
@app.get("/admin/acts")
@app.get("/api/admin/acts")
def admin_acts(db: Session = Depends(get_db)):
    rows = db.query(Act).order_by(Act.id.desc()).all()
    return [act_to_dict(a) for a in rows]

@app.get("/admin/venues")
@app.get("/api/admin/venues")
def admin_venues(db: Session = Depends(get_db)):
    rows = db.query(Venue).order_by(Venue.id.desc()).all()
    return [venue_to_dict(v) for v in rows]

@app.get("/admin/bookings")
@app.get("/api/admin/bookings")
def admin_bookings(db: Session = Depends(get_db)):
    rows = db.query(Booking).order_by(Booking.id.desc()).all()
    return [{
        "id": b.id,
        "customer_name": b.customer_name,
        "customer_email": b.customer_email,
        "date": b.date,
        "message": b.message,
        "act_id": b.act_id,
        "venue_id": b.venue_id,
        "created_at": b.created_at.isoformat() if b.created_at else None,
    } for b in rows]

@app.get("/admin/reviews")
@app.get("/api/admin/reviews")
def admin_reviews(status: Optional[str] = None, db: Session = Depends(get_db)):
    sql = "SELECT * FROM reviews"
    params = {}
    if status:
        sql += " WHERE status = :status"
        params["status"] = status
    sql += " ORDER BY id DESC LIMIT 500"
    
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]

@app.patch("/admin/reviews/{review_id}")
@app.patch("/api/admin/reviews/{review_id}")
def admin_update_review(review_id: int, status: str, db: Session = Depends(get_db)):
    if status not in ("approved", "rejected", "pending"):
        raise HTTPException(400, "Invalid status")
    
    db.execute(text("UPDATE reviews SET status = :status WHERE id = :id"), {
        "status": status,
        "id": review_id,
    })
    db.commit()
    
    return {"ok": True}

@app.get("/admin/submissions")
@app.get("/api/admin/submissions")
def admin_submissions(status: Optional[str] = None, db: Session = Depends(get_db)):
    sql = "SELECT * FROM submissions"
    params = {}
    if status:
        sql += " WHERE status = :status"
        params["status"] = status
    sql += " ORDER BY id DESC LIMIT 500"
    
    rows = db.execute(text(sql), params).mappings().all()
    result = []
    for r in rows:
        d = dict(r)
        try:
            d["payload"] = json.loads(d.get("payload_json") or "{}")
        except:
            d["payload"] = {}
        result.append(d)
    
    return result

@app.post("/admin/submissions/{submission_id}/approve")
@app.post("/api/admin/submissions/{submission_id}/approve")
def admin_approve_submission(submission_id: int, db: Session = Depends(get_db)):
    row = db.execute(text("""
        SELECT id, role, payload_json FROM submissions WHERE id = :id
    """), {"id": submission_id}).mappings().first()
    
    if not row:
        raise HTTPException(404, "Submission not found")
    
    payload = json.loads(row["payload_json"] or "{}")
    role = row["role"].lower()
    
    if role == "act":
        act = Act(
            name=payload.get("name", ""),
            location=payload.get("location", ""),
            act_type=payload.get("act_type", "Entertainment"),
            genres=payload.get("genres") or payload.get("genre", ""),
            price_from=payload.get("price_from"),
            description=payload.get("description", ""),
            rating=4.8,
            featured=False,
            premium=False,
        )
        db.add(act)
        db.flush()
        new_id = act.id
    else:
        venue = Venue(
            name=payload.get("name", ""),
            location=payload.get("location", ""),
            capacity=payload.get("capacity"),
            price_from=payload.get("price_from"),
            style=payload.get("style", ""),
            amenities=payload.get("amenities", ""),
            description=payload.get("description", ""),
            featured=False,
            premium=False,
        )
        db.add(venue)
        db.flush()
        new_id = venue.id
    
    db.execute(text("UPDATE submissions SET status = 'approved' WHERE id = :id"), {
        "id": submission_id
    })
    db.commit()
    
    return {"ok": True, "id": new_id}

# Initialize auxiliary tables
def ensure_tables():
    with SessionLocal() as db:
        # Reviews table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                rating INTEGER NOT NULL,
                comment TEXT NOT NULL,
                author_name VARCHAR(200),
                act_id INTEGER,
                venue_id INTEGER,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))
        
        # Submissions table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
                role VARCHAR(20) NOT NULL,
                payload_json TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))
        
        db.commit()

def seed_data():
    """Seed initial data if SEED=1"""
    if os.getenv("SEED") != "1":
        return
    
    db = SessionLocal()
    try:
        # Create admin user
        admin = db.query(User).filter(User.email == "admin@venuehub.local").first()
        if not admin:
            admin = User(
                email="admin@venuehub.local",
                password_hash=get_password_hash("admin123"),
                is_admin=True,
            )
            db.add(admin)
            db.commit()
        
        # Seed acts if empty
        if db.query(Act).count() == 0:
            acts = [
                Act(
                    name="Neon Pulse Band",
                    slug="neon-pulse-band",
                    act_type="Band",
                    location="London",
                    price_from=1200,
                    rating=4.9,
                    genres="Pop,Rock,Indie",
                    image_url="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
                    description="High-energy 5-piece band perfect for weddings and corporate events.",
                    featured=True,
                    premium=True,
                ),
                Act(
                    name="DJ Spectrum",
                    slug="dj-spectrum",
                    act_type="DJ",
                    location="Manchester",
                    price_from=600,
                    rating=4.7,
                    genres="House,EDM,Dance",
                    image_url="https://images.unsplash.com/photo-1571266028243-d220c8b0e9f7?w=800",
                    description="Professional DJ with 10+ years experience and premium sound system.",
                    featured=True,
                    premium=False,
                ),
                Act(
                    name="The Illusionist",
                    slug="the-illusionist",
                    act_type="Magician",
                    location="Birmingham",
                    price_from=450,
                    rating=5.0,
                    genres="Close-up,Stage,Comedy",
                    image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                    description="Award-winning magician for corporate and private events.",
                    featured=False,
                    premium=False,
                ),
            ]
            db.add_all(acts)
        
        # Seed venues if empty
        if db.query(Venue).count() == 0:
            venues = [
                Venue(
                    name="The Crystal Ballroom",
                    slug="crystal-ballroom",
                    location="London",
                    capacity=300,
                    price_from=2500,
                    style="Luxury",
                    image_url="https://images.unsplash.com/photo-1519167758481-83f29da8a4f0?w=800",
                    amenities="Chandeliers, Stage, Premium sound, Catering kitchen, Bar",
                    description="Stunning Victorian ballroom with modern facilities.",
                    featured=True,
                    premium=True,
                ),
                Venue(
                    name="Riverside Loft",
                    slug="riverside-loft",
                    location="Bristol",
                    capacity=150,
                    price_from=1200,
                    style="Industrial",
                    image_url="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
                    amenities="Waterfront views, Exposed brick, Natural light, Parking",
                    description="Modern industrial space with breathtaking river views.",
                    featured=True,
                    premium=False,
                ),
                Venue(
                    name="Garden Pavilion",
                    slug="garden-pavilion",
                    location="Oxford",
                    capacity=120,
                    price_from=900,
                    style="Garden",
                    image_url="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
                    amenities="Outdoor terrace, Gardens, Greenhouse bar, Fairy lights",
                    description="Charming garden venue perfect for summer celebrations.",
                    featured=False,
                    premium=False,
                ),
            ]
            db.add_all(venues)
        
        db.commit()
        print("✅ Database seeded successfully")
    except Exception as e:
        print(f"⚠️  Seeding error: {e}")
        db.rollback()
    finally:
        db.close()

@app.on_event("startup")
def startup():
    print("🚀 Starting VenueHub API...")
    init_db()
    ensure_tables()
    seed_data()
    print("✅ API ready!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
# === venuehub patch: auth/register + admin summary ===

from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    is_provider: bool | None = False
    is_business: bool | None = False

@app.post("/auth/register")
@app.post("/api/auth/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(409, "Email already registered")

    pwd_hash = get_password_hash(data.password)
    u = User(
        email=data.email,
        password_hash=pwd_hash,
        is_admin=False,
        is_provider=bool(data.is_provider),
        is_business=bool(data.is_business),
    )
    db.add(u)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Email already registered")
    db.refresh(u)
    return {
        "user": {
            "id": u.id,
            "email": u.email,
            "is_admin": bool(getattr(u, "is_admin", False)),
            "is_provider": bool(getattr(u, "is_provider", False)),
            "is_business": bool(getattr(u, "is_business", False)),
        }
    }

@app.get("/auth/me")
@app.get("/api/auth/me")
def me(email: EmailStr = Query(None), db: Session = Depends(get_db)):
    if not email:
        raise HTTPException(400, "email is required")
    u = db.query(User).filter(User.email == email).first()
    if not u:
        raise HTTPException(404, "User not found")
    return {
        "id": u.id,
        "email": u.email,
        "is_admin": bool(getattr(u, "is_admin", False)),
        "is_provider": bool(getattr(u, "is_provider", False)),
        "is_business": bool(getattr(u, "is_business", False)),
    }

@app.get("/admin/summary")
@app.get("/api/admin/summary")
def admin_summary(db: Session = Depends(get_db)):
    acts = db.query(Act).count()
    venues = db.query(Venue).count()
    bookings = db.query(Booking).count()
    pending_reviews = db.execute(text("SELECT COUNT(*) AS c FROM reviews WHERE status='pending'")).mappings().first()["c"]
    pending_subs = db.execute(text("SELECT COUNT(*) AS c FROM submissions WHERE status='pending'")).mappings().first()["c"]
    return {
        "acts": acts,
        "venues": venues,
        "bookings": bookings,
        "pending_reviews": pending_reviews,
        "pending_submissions": pending_subs,
    }

@app.on_event("startup")
def _vh_email_unique_index():
    try:
        with SessionLocal() as db:
            db.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users(email)"))
            db.commit()
    except Exception:
        pass

# === /venuehub patch end ===
# === venuehub neon patch: register + admin summary ===
from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    is_provider: bool | None = False
    is_business: bool | None = False

@app.post("/auth/register")
@app.post("/api/auth/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(409, "Email already registered")
    pwd_hash = get_password_hash(data.password)
    u = User(email=data.email, password_hash=pwd_hash,
             is_admin=False,
             is_provider=bool(data.is_provider),
             is_business=bool(data.is_business))
    db.add(u)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Email already registered")
    db.refresh(u)
    return {"user":{"id":u.id,"email":u.email,
                    "is_admin":bool(getattr(u,"is_admin",False)),
                    "is_provider":bool(getattr(u,"is_provider",False)),
                    "is_business":bool(getattr(u,"is_business",False))}}

@app.get("/admin/summary")
@app.get("/api/admin/summary")
def admin_summary(db: Session = Depends(get_db)):
    acts = db.query(Act).count()
    venues = db.query(Venue).count()
    bookings = db.query(Booking).count()
    pending_reviews = db.execute(text("SELECT COUNT(*) AS c FROM reviews WHERE status='pending'")).mappings().first()["c"]
    pending_subs = db.execute(text("SELECT COUNT(*) AS c FROM submissions WHERE status='pending'")).mappings().first()["c"]
    return {"acts":acts,"venues":venues,"bookings":bookings,
            "pending_reviews":pending_reviews,"pending_submissions":pending_subs}

@app.on_event("startup")
def _vh_email_unique_index():
    try:
        with SessionLocal() as db:
            db.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users(email)"))
            db.commit()
    except Exception:
        pass
# === /venuehub neon patch end ===
