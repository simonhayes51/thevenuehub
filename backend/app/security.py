import os, datetime, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b", bcrypt__truncate_error=False)
SECRET_KEY = os.getenv("SECRET_KEY","change_me")
def get_password_hash(p): return pwd_context.hash(p)
def verify_password(p,h): return pwd_context.verify(p,h)
def create_access_token(sub, roles):
    payload={"sub":sub,"roles":roles,"exp":datetime.datetime.utcnow()+datetime.timedelta(hours=8)}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
bearer = HTTPBearer(auto_error=False)
def require_user(tok: HTTPAuthorizationCredentials = Depends(bearer)):
    if tok is None: raise HTTPException(401,"Not authenticated")
    try: return jwt.decode(tok.credentials, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError: raise HTTPException(401,"Token expired")
    except Exception: raise HTTPException(401,"Invalid token")
def require_admin(p=Depends(require_user)):
    if not p.get("roles",{}).get("admin"): raise HTTPException(403,"Admin only"); return p
def require_provider(p=Depends(require_user)):
    if not p.get("roles",{}).get("provider"): raise HTTPException(403,"Provider only"); return p
def require_business(p=Depends(require_user)):
    if not p.get("roles",{}).get("business"): raise HTTPException(403,"Business only"); return p
