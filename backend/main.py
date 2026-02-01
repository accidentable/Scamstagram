import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from app.database import init_db, AsyncSessionLocal
from app.api.router import api_router
from app.models.user import User
from app.models.wallet import Wallet
from app.core.security import get_password_hash
from app.config import settings


async def create_admin_user():
    """Create admin user if not exists"""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.email == settings.ADMIN_EMAIL)
        )
        admin = result.scalar_one_or_none()

        if not admin:
            admin = User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                is_admin=True,
                is_verified=True,
                level=10,
                avatar=f"https://picsum.photos/seed/admin/200/200"
            )
            db.add(admin)
            await db.flush()

            # Create wallet for admin
            wallet = Wallet(user_id=admin.id, balance=10000)
            db.add(wallet)

            await db.commit()
            print(f"Admin user created: {settings.ADMIN_EMAIL}")
        else:
            print(f"Admin user already exists: {settings.ADMIN_EMAIL}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")

    # Create upload directory
    try:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    except Exception as e:
        print(f"Warning: Could not create upload dir: {e}")

    # Initialize database
    try:
        await init_db()
        print("Database initialized")
        
        # Create admin user
        await create_admin_user()
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        print("App will start but database features may not work")

    yield

    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title="ScamStagram API",
    description="AI-based Scam Prevention and Community Reward Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.(run\.app|web\.app|loca\.lt|firebaseapp\.com)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API router
app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "message": "ScamStagram API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
