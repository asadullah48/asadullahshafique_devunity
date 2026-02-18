"""
Database Models
===============
SQLAlchemy ORM models for DevUnity portfolio.

Models:
- ContactMessage: Contact form submissions
- Video: Uploaded videos
- LearningProgress: User learning tracking
- TaughtContent: User-contributed teaching content
- BackendlessProject: Frontend-only projects
- NoTeachLLM: Privacy opt-out registry
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from database import Base


class ContactMessage(Base):
    """Contact form submission model."""
    
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    read = Column(Boolean, default=False)
    responded = Column(Boolean, default=False)


class Video(Base):
    """Video upload model."""
    
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    uploader = Column(String(200), default="Anonymous")
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    file_path = Column(String(500), nullable=False)
    thumbnail = Column(String(500), nullable=True)
    duration = Column(String(50), nullable=True)
    tags = Column(JSON, default=list)  # Store as JSON array
    views = Column(Integer, default=0)
    active = Column(Boolean, default=True)


class LearningProgress(Base):
    """User learning progress tracking."""
    
    __tablename__ = "learning_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=True)
    email = Column(String(200), nullable=True)
    topic = Column(String(200), nullable=False)
    level = Column(String(50), default="beginner")
    learning_style = Column(String(50), default="interactive")
    progress = Column(Float, default=0.0)  # 0-100%
    completed = Column(Boolean, default=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    metadata = Column(JSON, default=dict)  # Additional data


class TaughtContent(Base):
    """User-contributed teaching content."""
    
    __tablename__ = "taught_content"
    
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    difficulty = Column(String(50), default="intermediate")
    examples = Column(JSON, default=list)
    contributor_id = Column(String(100), nullable=True)
    contributor_email = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    approved = Column(Boolean, default=False)
    views = Column(Integer, default=0)


class BackendlessProject(Base):
    """Backendless (frontend-only) project showcase."""
    
    __tablename__ = "backendless_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    framework = Column(String(50), nullable=False)  # nextjs, react, vue, etc.
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    tech_stack = Column(JSON, default=list)
    features = Column(JSON, default=list)
    screenshots = Column(JSON, default=list)
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_date = Column(DateTime(timezone=True), onupdate=func.now())
    featured = Column(Boolean, default=False)


class NoTeachLLM(Base):
    """NoTeachLLM privacy opt-out registry."""
    
    __tablename__ = "noteachllm_registry"
    
    id = Column(Integer, primary_key=True, index=True)
    opt_out_id = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(String(100), nullable=True)
    email = Column(String(200), nullable=True, index=True)
    reason = Column(Text, nullable=True)
    scope = Column(String(50), default="all")  # all, learning, teaching, analytics
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    active = Column(Boolean, default=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)


# Index for faster lookups
from sqlalchemy import Index

Index('idx_contact_email', ContactMessage.email)
Index('idx_video_uploader', Video.uploader)
Index('idx_learning_user', LearningProgress.user_id)
Index('idx_project_framework', BackendlessProject.framework)
