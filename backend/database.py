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
import logging
import os

logger = logging.getLogger(__name__)

# Database URL - SQLite for dev, PostgreSQL for production
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./devunity.db"
)


# ─── Async-driver guard ──────────────────────────────────────────────────────
# This module is fully SYNCHRONOUS: create_engine + Session, not
# create_async_engine + AsyncSession. Handing it an async driver URL does not
# fail with a clear message - it dies deep inside SQLAlchemy with
#
#   sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called
#
# raised from dialects/postgresql/asyncpg.py. The traceback names greenlet and
# reads like a broken environment, so the real cause (an async driver in a sync
# engine) is easy to chase for a long time. It cost exactly that here: every
# backend test errored and uvicorn exited with code 3, because a
# postgresql+asyncpg Neon URL was exported in the shell.
#
# Rather than crash, normalise to the sync driver and say so loudly.
_ASYNC_TO_SYNC = {
    "postgresql+asyncpg": "postgresql+psycopg2",
    "mysql+aiomysql": "mysql+pymysql",
    "sqlite+aiosqlite": "sqlite",
}


def _normalise_driver(url: str) -> str:
    """Coerce a known async driver URL to its sync equivalent."""
    for async_prefix, sync_prefix in _ASYNC_TO_SYNC.items():
        if url.startswith(async_prefix + "://"):
            logger.error(
                "DATABASE_URL uses the async driver %r, but database.py is a "
                "synchronous engine. Rewriting to %r. Set DATABASE_URL to a sync "
                "driver to silence this. NOTE: async and sync drivers spell TLS "
                "options differently (asyncpg uses ?ssl=require, psycopg2 uses "
                "?sslmode=require) - fix the query string too if the connection "
                "is refused.",
                async_prefix,
                sync_prefix,
            )
            return sync_prefix + url[len(async_prefix):]
    return url


DATABASE_URL = _normalise_driver(DATABASE_URL)

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
