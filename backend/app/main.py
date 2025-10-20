import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db, seed_if_needed
from sqlalchemy.orm import Session
from .db import SessionLocal
from .models import Act, Venue
from .routers import auth, acts, venues, featured, reviews, bookings, admin, me, business
app = FastAPI(title="VenueHub API", version="0.3.0")

# ----- CORS setup (env-driven) -----
_ALLOWED = os.getenv("ALLOWED_ORIGINS")  # e.g. "*", or "https://foo,https://bar"
_default = ["https://venuehub-frontend-production.up.railway.app", "http://localhost:5173"]
origins = [o.strip() for o in _ALLOWED.split(",")] if _ALLOWED else _default
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
# ----- Fallback CORS (belt & braces) -----
@app.middleware("http")
async def _force_cors_headers(request, call_next):
    # Handle preflight quickly
    if request.method == "OPTIONS":
        resp = Response(status_code=204)
    else:
        resp = await call_next(request)

    # Always set permissive headers (OK because we use token auth, not cookies)
    resp.headers.setdefault("Access-Control-Allow-Origin", "*" if wildcard else request.headers.get("origin", ""))
    resp.headers.setdefault("Vary", "Origin")
    resp.headers.setdefault("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    resp.headers.setdefault("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin,X-Requested-With")
    resp.headers.setdefault("Access-Control-Allow-Credentials", "true" if allow_credentials else "false")
    return resp

# --- lightweight DB dependency & serializers ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _act_to_dict(a: Act):
    if a is None: return None
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
    if v is None: return None
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

# --- root endpoints so frontend can call /acts and /acts/{id} (and same for venues) ---
@app.get("/acts")
def root_list_acts(db: Session = Depends(get_db)):
    rows = db.query(Act).order_by(Act.premium.desc(), Act.featured.desc(), Act.id.desc()).all()
    return [_act_to_dict(a) for a in rows]

@app.get("/acts/{act_id}")
def root_get_act(act_id: int, db: Session = Depends(get_db)):
    a = db.query(Act).filter(Act.id == act_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Act not found")
    return _act_to_dict(a)

@app.get("/venues")
def root_list_venues(db: Session = Depends(get_db)):
    rows = db.query(Venue).order_by(Venue.premium.desc(), Venue.featured.desc(), Venue.id.desc()).all()
    return [_venue_to_dict(v) for v in rows]

@app.get("/venues/{venue_id}")
def root_get_venue(venue_id: int, db: Session = Depends(get_db)):
    v = db.query(Venue).filter(Venue.id == venue_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Venue not found")
    return _venue_to_dict(v)


# Catch-all OPTIONS (some proxies bypass app routes for preflight)
@app.options("/{rest_of_path:path}")
def _options_catch_all():
    return Response(status_code=204)
# -----------------------------------
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
from .routers import acts as acts_router, venues as venues_router, featured as featured_router, reviews as reviews_router, bookings as bookings_router, admin as admin_router, me as me_router, business as business_router
app.include_router(acts_router.router, prefix="/api", tags=["acts"])
app.include_router(venues_router.router, prefix="/api", tags=["venues"])
app.include_router(featured_router.router, prefix="/api", tags=["featured"])
app.include_router(reviews_router.router, prefix="/api", tags=["reviews"])
app.include_router(bookings_router.router, prefix="/api", tags=["bookings"])
app.include_router(admin_router.router, prefix="/api/admin", tags=["admin"])
app.include_router(me_router.router, prefix="/api", tags=["me"])
app.include_router(business_router.router, prefix="/api", tags=["business"])
@app.on_event("startup")
def on_startup():
    init_db(); seed_if_needed()
@app.get("/api/health")
def health(): return {"status":"ok"}



from .routes.public import router as public_router

# Public API at root
app.include_router(public_router, prefix="")

# Same public API under /api
app.include_router(public_router, prefix="/api")
