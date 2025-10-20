import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db, seed_if_needed
from .routers import auth, acts, venues, featured, reviews, bookings, admin, me, business
app = FastAPI(title="VenueHub API", version="0.3.0")
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

