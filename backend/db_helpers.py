"""
Database Helper Functions
=========================
Reusable database operations for DevUnity portfolio.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional, Dict, Any
from datetime import datetime

from models import (
    ContactMessage, Video, LearningProgress, 
    TaughtContent, BackendlessProject, NoTeachLLM
)


# ─── Contact Messages ─────────────────────────────────────────────────────────
def create_contact_message(db: Session, name: str, email: str, subject: str, message: str) -> ContactMessage:
    """Create a new contact message."""
    db_message = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_contact_messages(db: Session, limit: int = 100) -> List[ContactMessage]:
    """Get all contact messages."""
    return db.query(ContactMessage).order_by(desc(ContactMessage.timestamp)).limit(limit).all()


def mark_message_read(db: Session, message_id: int) -> Optional[ContactMessage]:
    """Mark a contact message as read."""
    db_message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if db_message:
        db_message.read = True
        db.commit()
        db.refresh(db_message)
    return db_message


# ─── Videos ───────────────────────────────────────────────────────────────────
def create_video(db: Session, title: str, description: str, file_path: str, 
                 uploader: str = "Anonymous", tags: List[str] = None) -> Video:
    """Create a new video entry."""
    db_video = Video(
        title=title,
        description=description,
        file_path=file_path,
        uploader=uploader,
        tags=tags or [],
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video


def get_videos(db: Session, tag: Optional[str] = None, limit: int = 100) -> List[Video]:
    """Get all videos, optionally filtered by tag."""
    query = db.query(Video).filter(Video.active == True)
    if tag:
        query = query.filter(Video.tags.contains([tag]))
    return query.order_by(desc(Video.upload_date)).limit(limit).all()


def get_video(db: Session, video_id: int) -> Optional[Video]:
    """Get a single video by ID."""
    return db.query(Video).filter(Video.id == video_id).first()


def delete_video(db: Session, video_id: int) -> bool:
    """Delete a video."""
    db_video = db.query(Video).filter(Video.id == video_id).first()
    if db_video:
        db_video.active = False  # Soft delete
        # Or use: db.delete(db_video) for hard delete
        db.commit()
        return True
    return False


def increment_video_views(db: Session, video_id: int) -> Optional[Video]:
    """Increment video view count."""
    db_video = db.query(Video).filter(Video.id == video_id).first()
    if db_video:
        db_video.views = (db_video.views or 0) + 1
        db.commit()
        db.refresh(db_video)
    return db_video


# ─── Learning Progress ────────────────────────────────────────────────────────
def create_learning_progress(db: Session, topic: str, level: str = "beginner",
                             learning_style: str = "interactive",
                             user_id: str = None, email: str = None) -> LearningProgress:
    """Create a new learning progress entry."""
    db_progress = LearningProgress(
        topic=topic,
        level=level,
        learning_style=learning_style,
        user_id=user_id,
        email=email,
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


def get_learning_progress(db: Session, user_id: str = None, email: str = None) -> List[LearningProgress]:
    """Get learning progress for a user."""
    query = db.query(LearningProgress)
    if user_id:
        query = query.filter(LearningProgress.user_id == user_id)
    if email:
        query = query.filter(LearningProgress.email == email)
    return query.order_by(desc(LearningProgress.started_at)).all()


def update_learning_progress(db: Session, progress_id: int, 
                             progress: float = None, completed: bool = None) -> Optional[LearningProgress]:
    """Update learning progress."""
    db_progress = db.query(LearningProgress).filter(LearningProgress.id == progress_id).first()
    if db_progress:
        if progress is not None:
            db_progress.progress = progress
        if completed is not None:
            db_progress.completed = completed
            if completed:
                db_progress.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_progress)
    return db_progress


# ─── Taught Content ───────────────────────────────────────────────────────────
def create_taught_content(db: Session, topic: str, content: str, 
                          difficulty: str = "intermediate", examples: List[str] = None,
                          contributor_id: str = None, contributor_email: str = None) -> TaughtContent:
    """Create a new taught content entry."""
    db_content = TaughtContent(
        topic=topic,
        content=content,
        difficulty=difficulty,
        examples=examples or [],
        contributor_id=contributor_id,
        contributor_email=contributor_email,
    )
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content


def get_taught_content(db: Session, topic: Optional[str] = None, 
                       approved: bool = None) -> List[TaughtContent]:
    """Get taught content, optionally filtered by topic."""
    query = db.query(TaughtContent)
    if topic:
        query = query.filter(TaughtContent.topic.ilike(f"%{topic}%"))
    if approved is not None:
        query = query.filter(TaughtContent.approved == approved)
    return query.order_by(desc(TaughtContent.created_at)).all()


def approve_taught_content(db: Session, content_id: int) -> Optional[TaughtContent]:
    """Approve taught content."""
    db_content = db.query(TaughtContent).filter(TaughtContent.id == content_id).first()
    if db_content:
        db_content.approved = True
        db.commit()
        db.refresh(db_content)
    return db_content


# ─── Backendless Projects ─────────────────────────────────────────────────────
def create_backendless_project(db: Session, name: str, description: str, framework: str,
                               github_url: str = None, demo_url: str = None,
                               tech_stack: List[str] = None, features: List[str] = None) -> BackendlessProject:
    """Create a new backendless project."""
    db_project = BackendlessProject(
        name=name,
        description=description,
        framework=framework,
        github_url=github_url,
        demo_url=demo_url,
        tech_stack=tech_stack or [],
        features=features or [],
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_backendless_projects(db: Session, framework: Optional[str] = None,
                             featured: bool = None) -> List[BackendlessProject]:
    """Get backendless projects, optionally filtered by framework."""
    query = db.query(BackendlessProject)
    if framework:
        query = query.filter(BackendlessProject.framework == framework)
    if featured is not None:
        query = query.filter(BackendlessProject.featured == featured)
    return query.order_by(desc(BackendlessProject.created_date)).all()


def get_backendless_project(db: Session, project_id: int) -> Optional[BackendlessProject]:
    """Get a single backendless project."""
    return db.query(BackendlessProject).filter(BackendlessProject.id == project_id).first()


def update_backendless_project(db: Session, project_id: int, 
                               updates: Dict[str, Any]) -> Optional[BackendlessProject]:
    """Update a backendless project."""
    db_project = db.query(BackendlessProject).filter(BackendlessProject.id == project_id).first()
    if db_project:
        allowed_fields = ["name", "description", "github_url", "demo_url", "tech_stack", "features", "featured"]
        for field, value in updates.items():
            if field in allowed_fields:
                setattr(db_project, field, value)
        db.commit()
        db.refresh(db_project)
    return db_project


def delete_backendless_project(db: Session, project_id: int) -> bool:
    """Delete a backendless project."""
    db_project = db.query(BackendlessProject).filter(BackendlessProject.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False


# ─── NoTeachLLM Registry ──────────────────────────────────────────────────────
def create_opt_out(db: Session, opt_out_id: str, scope: str = "all",
                   user_id: str = None, email: str = None, reason: str = None) -> NoTeachLLM:
    """Create a new opt-out entry."""
    db_opt_out = NoTeachLLM(
        opt_out_id=opt_out_id,
        scope=scope,
        user_id=user_id,
        email=email,
        reason=reason,
    )
    db.add(db_opt_out)
    db.commit()
    db.refresh(db_opt_out)
    return db_opt_out


def get_opt_out(db: Session, opt_out_id: str = None, 
                email: str = None, user_id: str = None) -> Optional[NoTeachLLM]:
    """Get opt-out by ID, email, or user_id."""
    query = db.query(NoTeachLLM).filter(NoTeachLLM.active == True)
    if opt_out_id:
        return query.filter(NoTeachLLM.opt_out_id == opt_out_id).first()
    if email:
        return query.filter(NoTeachLLM.email == email).first()
    if user_id:
        return query.filter(NoTeachLLM.user_id == user_id).first()
    return None


def revoke_opt_out(db: Session, opt_out_id: str) -> Optional[NoTeachLLM]:
    """Revoke an opt-out."""
    db_opt_out = db.query(NoTeachLLM).filter(NoTeachLLM.opt_out_id == opt_out_id).first()
    if db_opt_out:
        db_opt_out.active = False
        db_opt_out.revoked_at = datetime.utcnow()
        db.commit()
        db.refresh(db_opt_out)
    return db_opt_out
