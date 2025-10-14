from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "RoleColorAI"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: Optional[str] = None
    
    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.7
    
    # RoleColorFinder API
    ROLECOLORFINDER_API_URL: str = "https://api.rolecolorfinder.com"
    ROLECOLORFINDER_API_KEY: Optional[str] = None
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["pdf", "docx", "txt"]
    UPLOAD_DIR: str = "uploads"
    
    # Storage Configuration
    SUPABASE_BUCKET_NAME: str = "resumes"
    SUPABASE_EXPORTS_BUCKET: str = "exports"
    
    # Database Configuration (if using local PostgreSQL)
    DATABASE_URL: Optional[str] = None
    
    # Redis Configuration (optional)
    REDIS_URL: Optional[str] = None
    
    # Email Configuration
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    # Feature Flags
    ENABLE_BRANDING_TOGGLE: bool = True
    ENABLE_BATCH_PROCESSING: bool = False
    ENABLE_ANALYTICS: bool = True
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Validate required settings
def validate_settings():
    """Validate that all required settings are present"""
    required_settings = [
        "SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY", 
        "OPENAI_API_KEY"
    ]
    
    missing_settings = []
    for setting in required_settings:
        if not getattr(settings, setting, None):
            missing_settings.append(setting)
    
    if missing_settings:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_settings)}")

# Validate on import
try:
    validate_settings()
except ValueError as e:
    if settings.ENVIRONMENT != "test":
        print(f"Warning: {e}")
        print("Some features may not work correctly without proper configuration.")
