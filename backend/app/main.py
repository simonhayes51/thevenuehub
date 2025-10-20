from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db, seed_if_needed
from .routers import acts, venues, bookings, auth, admin

app = FastAPI(title="VenueHub API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(acts.router, prefix="/api", tags=["acts"])
app.include_router(venues.router, prefix="/api", tags=["venues"])
app.include_router(bookings.router, prefix="/api", tags=["bookings"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.on_event("startup")
def on_startup():
    init_db()
    seed_if_needed()

@app.get("/api/health")
def health():
    return {"status": "ok"}
