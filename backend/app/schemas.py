from pydantic import BaseModel, EmailStr
from typing import Optional
class Token(BaseModel): access_token: str; token_type: str="bearer"
class LoginRequest(BaseModel): email: str; password: str
class ProviderIn(BaseModel):
    display_name: str; phone: Optional[str]=None; website: Optional[str]=None; location: Optional[str]=None; bio: Optional[str]=None
class ProviderOut(ProviderIn):
    id: int; status: str
    class Config: from_attributes=True
class BusinessIn(BaseModel):
    company: str; contact_name: Optional[str]=None; phone: Optional[str]=None; website: Optional[str]=None
class BusinessOut(BusinessIn):
    id: int; plan: str; lead_credits: int
    class Config: from_attributes=True
class ActBase(BaseModel):
    name: str; act_type: str; location: str
    price_from: Optional[float]=None; rating: Optional[float]=None; genres: Optional[str]=None; image_url: Optional[str]=None
    video_url: Optional[str]=None; description: Optional[str]=None; slug: Optional[str]=None; featured: Optional[bool]=False; premium: Optional[bool]=False
class ActOut(ActBase):
    id: int
    class Config: from_attributes=True
class VenueBase(BaseModel):
    name: str; location: str; capacity: Optional[int]=None; price_from: Optional[float]=None; style: Optional[str]=None
    image_url: Optional[str]=None; amenities: Optional[str]=None; slug: Optional[str]=None; featured: Optional[bool]=False; premium: Optional[bool]=False
class VenueOut(VenueBase):
    id: int
    class Config: from_attributes=True
class PackageIn(BaseModel):
    act_id: int; name: str; price: float; duration_mins: Optional[int]=None; description: Optional[str]=None
class MediaIn(BaseModel):
    act_id: int; url: str; media_type: Optional[str]="image"; sort: Optional[int]=0
class AvailabilityIn(BaseModel):
    act_id: int; date: str; is_available: bool=True
class BookingBase(BaseModel):
    customer_name: str; customer_email: EmailStr; date: str; message: Optional[str]=None; act_id: Optional[int]=None; venue_id: Optional[int]=None
class BookingOut(BookingBase):
    id: int
    class Config: from_attributes=True
class ReviewBase(BaseModel):
    author_name: str; rating: int; comment: str; act_id: Optional[int]=None; venue_id: Optional[int]=None
class ReviewOut(ReviewBase):
    id: int; status: str; response: Optional[str]=None
    class Config: from_attributes=True
