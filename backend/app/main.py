# backend/app/main.py

import os
from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db import SessionLocal, init_db, seed_if_needed
from .models import Act, Venue
from fastapi import APIRouter

app = FastAPI(title="VenueHub API")

# -------------------- CORS (env-driven) --------------------
# ALLOWED_ORIGINS can be "*" or a comma-separated list of origins.
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

# Fallback CORS headers (belt & braces)
@app.middleware("http")
async def _force_cors_headers(request, call_next):
    if request.method == "OPTIONS":
        resp = Response(status_code=204)
    else:
        resp = await call_next(request)

    # Always set permissive CORS headers (safe because we use token auth, not cookies)
    resp.headers.setdefault("Access-Control-Allow-Origin", "*" if wildcard else request.headers.get("origin", ""))
    resp.headers.setdefault("Vary", "Origin")
    resp.headers.setdefault("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    resp.headers.setdefault("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin,X-Requested-With")
    resp.headers.setdefault("Access-Control-Allow-Credentials", "true" if allow_credentials else "false")
    return resp

# Catch-all OPTIONS so preflights never 404
@app.options("/{rest_of_path:path}")
def _options_catch_all():
    return Response(status_code=204)
# -----------------------------------------------------------


# --------------------- DB utilities ------------------------
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
# -----------------------------------------------------------


# ------------------------ Health ---------------------------
@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}
# -----------------------------------------------------------


# -------------- Public API router (acts/venues) ------------
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

# Mount the same router at root and at /api
app.include_router(public_router, prefix="")
app.include_router(public_router, prefix="/api")
# -----------------------------------------------------------


# ---------------------- Startup hooks ----------------------
@app.on_event("startup")
def _bootstrap():
    # Create tables, add missing columns (handled inside init_db/your db layer),
    # and seed if SEED=1
    init_db()
    seed_if_needed()
# -----------------------------------------------------------

