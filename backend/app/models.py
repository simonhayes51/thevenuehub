from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)

class Act(Base):
    __tablename__ = "acts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    act_type = Column(String(100), nullable=False)  # Band/DJ/Magician/etc.
    location = Column(String(120), nullable=False)
    price_from = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    description = Column(Text, nullable=True)

class Venue(Base):
    __tablename__ = "venues"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(120), nullable=False)
    capacity = Column(Integer, nullable=True)
    price_from = Column(Float, nullable=True)
    style = Column(String(120), nullable=True)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    date = Column(String(20), nullable=False)
    message = Column(Text, nullable=True)
    act_id = Column(Integer, ForeignKey("acts.id"), nullable=True)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=True)
