import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from .models import Base, User, Provider, Business, Act, Venue, Package, Media, Availability, Booking, Review, Lead
from .security import get_password_hash

DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./venuehub.db"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def _ensure_core_columns():
    with engine.begin() as conn:
        # users: role flags
        conn.exec_driver_sql("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;")
        conn.exec_driver_sql("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_provider boolean DEFAULT false;")
        conn.exec_driver_sql("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_business boolean DEFAULT false;")

        # acts/venues: premium/featured flags
        conn.exec_driver_sql("ALTER TABLE acts ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;")
        conn.exec_driver_sql("ALTER TABLE acts ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;")
        conn.exec_driver_sql("ALTER TABLE venues ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;")
        conn.exec_driver_sql("ALTER TABLE venues ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;")

        # slugs
        conn.exec_driver_sql("ALTER TABLE acts   ADD COLUMN IF NOT EXISTS slug text;")
        conn.exec_driver_sql("ALTER TABLE venues ADD COLUMN IF NOT EXISTS slug text;")

        # backfill missing slugs from name (safe/idempotent)
        conn.exec_driver_sql("""
        UPDATE acts
        SET slug = regexp_replace(lower(name), '[^a-z0-9]+','-','g')
        WHERE (slug IS NULL OR slug='') AND name IS NOT NULL;
        """)

        conn.exec_driver_sql("""
        UPDATE venues
        SET slug = regexp_replace(lower(name), '[^a-z0-9]+','-','g')
        WHERE (slug IS NULL OR slug='') AND name IS NOT NULL;
        """)

        # unique indexes on slugs (safe if already exist)
        conn.exec_driver_sql("CREATE UNIQUE INDEX IF NOT EXISTS acts_slug_idx   ON acts(slug);")
        conn.exec_driver_sql("CREATE UNIQUE INDEX IF NOT EXISTS venues_slug_idx ON venues(slug);")

def init_db():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    # Ensure columns exist before any ORM SELECT happens
    _ensure_core_columns()

def seed_if_needed():
    if os.getenv("SEED","0") != "1":
        return
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email=="admin@venuehub.co.uk").first()
        if not admin:
            admin = User(email="admin@venuehub.co.uk", password_hash=get_password_hash("admin123"), is_admin=True)
            db.add(admin)

        provu = db.query(User).filter(User.email=="artist@demo.co.uk").first()
        if not provu:
            provu = User(email="artist@demo.co.uk", password_hash=get_password_hash("artist123"), is_provider=True)
            db.add(provu); db.flush()
            db.add(Provider(user_id=provu.id, display_name="Neon Nights", location="Newcastle", bio="High-energy party band.", status="approved"))

        bizu = db.query(User).filter(User.email=="planner@demo.co.uk").first()
        if not bizu:
            bizu = User(email="planner@demo.co.uk", password_hash=get_password_hash("planner123"), is_business=True)
            db.add(bizu); db.flush()
            db.add(Business(user_id=bizu.id, company="Eventify Ltd", plan="free", lead_credits=3))

        if db.query(Venue).count()==0:
            db.add_all([
                Venue(name="The Grand Hall", slug="the-grand-hall", location="Newcastle", capacity=300, price_from=1500, style="Historic", image_url="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop", amenities="Stage, PA, Dressing Rooms, Parking", featured=True, premium=True),
                Venue(name="Coastal View Barn", slug="coastal-view-barn", location="Sunderland", capacity=120, price_from=900, style="Rustic", image_url="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop", amenities="Bar, Outdoor area, On-site catering", featured=True),
                Venue(name="City Lights Loft", slug="city-lights-loft", location="Leeds", capacity=80, price_from=600, style="Modern", image_url="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop", amenities="City view, Lighting rig, Lift access")
            ])

        if db.query(Act).count()==0:
            band = Act(name="Neon Nights Band", slug="neon-nights-band", act_type="Band", location="Newcastle", price_from=800, rating=4.8, genres="Pop,Party,Indie", image_url="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", description="High-energy party band for weddings & corporates.", featured=True, premium=True)
            dj   = Act(name="DJ Vortex", slug="dj-vortex", act_type="DJ", location="Manchester", price_from=500, rating=4.6, genres="Club,House,EDM", image_url="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop", description="Club-style mixes & crowd bangers.", featured=True)
            mag  = Act(name="The Close-Up Magician", slug="the-close-up-magician", act_type="Magician", location="Leeds", price_from=350, rating=4.9, genres="Close-up,Table,Comedy", image_url="https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1600&auto=format&fit=crop", description="Mind-blowing card & coin magic.")
            db.add_all([band, dj, mag]); db.flush()
            db.add(Package(act_id=band.id, name="Evening Set", price=1200, duration_mins=120, description="2x60min sets, party hits"))

        if db.query(Review).count()==0:
            db.add_all([
                Review(author_name="Alice", rating=5, comment="Absolutely smashed it!", act_id=1, status="visible"),
                Review(author_name="Ravi", rating=4, comment="Great energy all night.", act_id=1, status="visible"),
                Review(author_name="Mia", rating=5, comment="Venue was stunning and staff were lovely.", venue_id=1, status="visible"),
            ])

        if db.query(Booking).count()==0:
            b = Booking(customer_name="Alice Example", customer_email="alice@example.com", date="2026-06-18", act_id=1, message="Summer party for 200 people.")
            db.add(b); db.flush(); db.add(Lead(booking_id=b.id))

        db.commit()
    finally:
        db.close()


