from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ActBase(BaseModel):
    name: str
    act_type: str
    location: str
    price_from: Optional[float] = None
    rating: Optional[float] = None
    description: Optional[str] = None

class ActOut(ActBase):
    id: int
    class Config:
        from_attributes = True

class VenueBase(BaseModel):
    name: str
    location: str
    capacity: Optional[int] = None
    price_from: Optional[float] = None
    style: Optional[str] = None

class VenueOut(VenueBase):
    id: int
    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    date: str
    message: Optional[str] = None
    act_id: Optional[int] = None
    venue_id: Optional[int] = None

class BookingOut(BookingBase):
    id: int
    class Config:
        from_attributes = True
