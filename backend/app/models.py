from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
Base = declarative_base()
class User(Base):
    __tablename__="users"
    id=Column(Integer, primary_key=True); email=Column(String(255), unique=True, nullable=False, index=True)
    password_hash=Column(String(255), nullable=False)
    is_admin=Column(Boolean, default=False); is_provider=Column(Boolean, default=False); is_business=Column(Boolean, default=False)
class Provider(Base):
    __tablename__="providers"
    id=Column(Integer, primary_key=True); user_id=Column(Integer, ForeignKey("users.id"), unique=True)
    display_name=Column(String(120), nullable=False); phone=Column(String(40)); website=Column(String(255))
    location=Column(String(120)); bio=Column(Text); status=Column(String(20), default="pending")
class Business(Base):
    __tablename__="businesses"
    id=Column(Integer, primary_key=True); user_id=Column(Integer, ForeignKey("users.id"), unique=True)
    company=Column(String(120)); contact_name=Column(String(120)); phone=Column(String(40)); website=Column(String(255))
    plan=Column(String(20), default="free"); lead_credits=Column(Integer, default=3)
class Act(Base):
    __tablename__="acts"
    id=Column(Integer, primary_key=True); slug=Column(String(255), unique=True, index=True)
    name=Column(String(255), nullable=False); act_type=Column(String(100), nullable=False); location=Column(String(120), nullable=False)
    price_from=Column(Float); rating=Column(Float); genres=Column(String(255)); image_url=Column(Text); video_url=Column(Text); description=Column(Text)
    featured=Column(Boolean, default=False); premium=Column(Boolean, default=False)
class Package(Base):
    __tablename__="packages"
    id=Column(Integer, primary_key=True); act_id=Column(Integer, ForeignKey("acts.id"))
    name=Column(String(120), nullable=False); price=Column(Float, nullable=False); duration_mins=Column(Integer); description=Column(Text)
class Media(Base):
    __tablename__="media"
    id=Column(Integer, primary_key=True); act_id=Column(Integer, ForeignKey("acts.id"))
    url=Column(Text, nullable=False); media_type=Column(String(20), default="image"); sort=Column(Integer, default=0)
class Availability(Base):
    __tablename__="availability"
    id=Column(Integer, primary_key=True); act_id=Column(Integer, ForeignKey("acts.id")); date=Column(String(20), nullable=False); is_available=Column(Boolean, default=True)
class Venue(Base):
    __tablename__="venues"
    id=Column(Integer, primary_key=True); slug=Column(String(255), unique=True, index=True); name=Column(String(255), nullable=False)
    location=Column(String(120), nullable=False); capacity=Column(Integer); price_from=Column(Float); style=Column(String(120))
    image_url=Column(Text); amenities=Column(Text); featured=Column(Boolean, default=False); premium=Column(Boolean, default=False)
class Booking(Base):
    __tablename__="bookings"
    id=Column(Integer, primary_key=True); customer_name=Column(String(255), nullable=False); customer_email=Column(String(255), nullable=False)
    date=Column(String(20), nullable=False); message=Column(Text); act_id=Column(Integer, ForeignKey("acts.id")); venue_id=Column(Integer, ForeignKey("venues.id"))
    created_at=Column(DateTime(timezone=True), server_default=func.now())
class Review(Base):
    __tablename__="reviews"
    id=Column(Integer, primary_key=True); author_name=Column(String(120), nullable=False); rating=Column(Integer, nullable=False)
    comment=Column(Text, nullable=False); act_id=Column(Integer, ForeignKey("acts.id")); venue_id=Column(Integer, ForeignKey("venues.id"))
    created_at=Column(DateTime(timezone=True), server_default=func.now()); status=Column(String(20), default="visible"); response=Column(Text)
class Lead(Base):
    __tablename__="leads"
    id=Column(Integer, primary_key=True); booking_id=Column(Integer, ForeignKey("bookings.id"))
    unlocked_by_business_id=Column(Integer, ForeignKey("businesses.id"), nullable=True)
from sqlalchemy import Column, Integer, Text, TIMESTAMP
from .db import Base

class Enquiry(Base):
    __tablename__ = "enquiries"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(Text)
    customer_email = Column(Text)
    date = Column(Text)
    message = Column(Text)
    act_id = Column(Integer)
    venue_id = Column(Integer)
    created_at = Column(TIMESTAMP, nullable=True)
