import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db, seed_if_needed
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
