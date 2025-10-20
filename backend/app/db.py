import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .models import Base, Act, Venue, Booking, User
from .security import get_password_hash

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./venuehub.db")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

BaseModel = declarative_base()

def init_db():
    from . import models  # noqa
    Base.metadata.create_all(bind=engine)

def seed_if_needed():
    if os.getenv("SEED", "0") != "1":
        return
    db = SessionLocal()
    try:
        # Seed admin user if not exists
        if not db.query(User).filter(User.email == "admin@venuehub.local").first():
            admin = User(
                email="admin@venuehub.local",
                password_hash=get_password_hash("admin123"),
                is_admin=True,
            )
            db.add(admin)
        # Seed venues
        if db.query(Venue).count() == 0:
            venues = [
                Venue(name="The Grand Hall", location="Newcastle", capacity=300, price_from=1500, style="Historic"),
                Venue(name="Coastal View Barn", location="Sunderland", capacity=120, price_from=900, style="Rustic"),
                Venue(name="City Lights Loft", location="Leeds", capacity=80, price_from=600, style="Modern"),
            ]
            db.add_all(venues)
        # Seed acts
        if db.query(Act).count() == 0:
            acts = [
                Act(name="Neon Nights Band", act_type="Band", location="Newcastle", price_from=800, rating=4.8, description="High‑energy party band."),
                Act(name="DJ Vortex", act_type="DJ", location="Manchester", price_from=500, rating=4.6, description="Club‑style mixes & crowd bangers."),
                Act(name="The Close‑Up Magician", act_type="Magician", location="Leeds", price_from=350, rating=4.9, description="Mind‑blowing card & coin magic."),
            ]
            db.add_all(acts)
        # Seed a booking
        if db.query(Booking).count() == 0:
            sample = Booking(
                customer_name="Alice Example",
                customer_email="alice@example.com",
                date="2025-12-12",
                act_id=1,
                message="Looking to book Neon Nights for a winter ball."
            )
            db.add(sample)
        db.commit()
    finally:
        db.close()
