from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/scamstagram"

    # JWT
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # File Upload
    UPLOAD_DIR: str = "uploads/images"

    # Admin
    ADMIN_EMAIL: str = "admin@scamstagram.com"
    ADMIN_PASSWORD: str = "admin123"
    ADMIN_USERNAME: str = "admin"

    # Reward Points
    REWARD_REPORT: int = 100
    REWARD_QUIZ_CORRECT: int = 50
    REWARD_SOCIAL_LIKE: int = 5
    REWARD_SOCIAL_COMMENT: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
