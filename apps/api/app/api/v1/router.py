from fastapi import APIRouter
from app.api.v1.endpoints import auth, resumes, exports, users

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(exports.router, prefix="/exports", tags=["exports"])

@api_router.get("/")
async def api_root():
    """API v1 root endpoint"""
    return {
        "message": "RoleColorAI API v1",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth",
            "users": "/users", 
            "resumes": "/resumes",
            "exports": "/exports"
        }
    }
