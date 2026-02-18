"""
Database Configuration and Session Management
=============================================
SQLAlchemy database setup for DevUnity portfolio.

Supports:
- SQLite (development)
- PostgreSQL (production)

Usage:
    from database import get_db, Base, engine
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Use in FastAPI
    @app.get("/items")
    def get_items(db: Session = Depends(get_db)):
        ...
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import os

# Database URL - SQLite for dev, PostgreSQL for production
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./devunity.db"
)

# PostgreSQL example:
# DATABASE_URL = "postgresql://user:password@localhost:5432/devunity"

# Engine configuration
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",  # SQL logging
    pool_pre_ping=True,  # Connection health check
    pool_size=10,  # Connection pool size
    max_overflow=20,  # Max overflow connections
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


@contextmanager
def get_db_context():
    """Context manager for database sessions."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db():
    """
    Dependency for FastAPI routes.
    
    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables."""
    from models import ContactMessage, Video, LearningProgress, TaughtContent, BackendlessProject, NoTeachLLM
    
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database initialized successfully!")
    print(f"📁 Database location: {DATABASE_URL}")


if __name__ == "__main__":
    init_db()
