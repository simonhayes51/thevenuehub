import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Database URL (Railway/Env) ---
# Try common env var names; fail clearly if none present.
DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL")
    or os.getenv("POSTGRESQL_URL")
    or os.getenv("PG_URL")
)

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

# --- SQLAlchemy Core ---
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
)

# This is what models import:
Base = declarative_base()

def init_db():
    """
    Import models inside the function so we don't create an import loop.
    Then create tables.
    """
    from . import models  # noqa: F401  (ensures models are registered)
    Base.metadata.create_all(bind=engine)

def seed_if_needed():
    """
    Optional: put any lightweight seeding here.
    Import inside the function to avoid circular imports.
    """
    try:
        from .models import User  # noqa
    except Exception:
        # If models aren't ready or User not defined, skip silently.
        return

    # Example no-op seed (safe default).
    # Fill this if you need an admin user created.
    return
