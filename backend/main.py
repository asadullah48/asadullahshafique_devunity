"""
Asadullah.dev Portfolio — FastAPI Backend
==========================================
Production-ready API backend for Asadullah Shafique's portfolio.

Endpoints:
  - /api/contact        Contact form submission + Discord webhook
  - /api/blog           Blog posts API
  - /api/github/stats   GitHub profile stats proxy
  - /api/agent/chat     LangGraph agentic portfolio assistant
  - /api/agent/solve-error  AI agent that solves coding errors
  - /api/video/upload   Video upload endpoint
  - /api/video/list     List uploaded videos
  - /api/learn          Learn through LLM feature
  - /api/teach          Teach to LLM feature
  - /api/noteachllm     NoTeachLLM - Opt-out of AI training
  - /api/backendless    Backendless project support
  - /mcp/*              MCP (Model Context Protocol) server tools

Run locally:
    uvicorn main:app --reload --port 8000

Docs at: http://localhost:8000/docs
Production: Deploy to Hugging Face Spaces with Docker SDK

Supports:
  - Full-stack projects (with backend)
  - Backendless projects (static/frontend-only)
  - NoTeachLLM privacy controls
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx
import os
import logging
import base64
import json
import shutil
from pathlib import Path
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Local modules
from agent import run_agent, run_error_solver_agent, run_learning_agent, run_teaching_agent
from mcp_server import router as mcp_router
from database import engine, get_db, init_db, Base
from models import ContactMessage, Video, LearningProgress, TaughtContent, BackendlessProject, NoTeachLLM
from db_helpers import (
    create_contact_message, get_contact_messages, mark_message_read,
    create_video, get_videos, get_video, delete_video, increment_video_views,
    create_learning_progress, get_learning_progress, update_learning_progress,
    create_taught_content, get_taught_content, approve_taught_content,
    create_backendless_project, get_backendless_projects, get_backendless_project,
    update_backendless_project, delete_backendless_project,
    create_opt_out, get_opt_out, revoke_opt_out,
)

# ─── Logging Configuration ────────────────────────────────────────────────────
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ─── App Setup ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="Asadullah.dev Portfolio API",
    description="""
## Backend API for Asadullah Shafique's Portfolio

This API powers the [asadullah.dev](https://asadullah.dev) portfolio website.

### Features
- **Contact Form**: Submit messages with Discord webhook notifications
- **Blog Posts**: Retrieve blog articles and featured posts
- **GitHub Stats**: Real-time GitHub profile statistics
- **AI Agent**: LangGraph-powered portfolio assistant
- **MCP Server**: Model Context Protocol integration for AI tools
- **Video Upload**: Upload and manage educational videos
- **Learning Platform**: Learn through LLM and teach to LLM
- **Privacy Controls**: NoTeachLLM opt-out system
- **Backendless Projects**: Showcase frontend-only projects

### Authentication
Currently open for demo purposes. Add API key authentication before production use.

### Database
Uses SQLite for development, PostgreSQL for production.
    """,
    version="2.3.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ─── Rate Limiting Setup ──────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — allow your frontend origins
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

# Default origins if none specified
if not origins:
    origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://asadullahshafique-devunity.vercel.app",
        "https://asadullah.dev",
        "https://asadullah48.github.io",
    ]

logger.info(f"Configured CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount MCP server router
app.include_router(mcp_router)

# ─── Database Initialization ──────────────────────────────────────────────────
@app.on_event("startup")
async def startup_db():
    """Initialize database on startup."""
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database initialized")

# ─── Environment Variables ────────────────────────────────────────────────────
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL", "")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "asadullah48")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# ─── Models ──────────────────────────────────────────────────────────────────
class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "subject": "Project Collaboration",
                "message": "I'd like to discuss a potential collaboration.",
            }
        }


class ContactResponse(BaseModel):
    success: bool
    message: str


class BlogPost(BaseModel):
    id: int
    title: str
    excerpt: str
    content: Optional[str] = None
    date: str
    read_time: str
    tags: list[str]
    slug: str
    featured: bool = False


class GitHubStats(BaseModel):
    public_repos: int
    followers: int
    following: int
    total_stars: int
    top_languages: list[str]


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    environment: str


class ErrorResponse(BaseModel):
    detail: str
    status_code: int = 500


# ─── In-Memory Storage (DEPRECATED - Using Database Now) ─────────────────────
# These are kept for backwards compatibility but new code should use database
# contact_messages: list[dict] = []  # → ContactMessage model
# uploaded_videos: list[dict] = []   # → Video model
# learning_progress: list[dict] = [] # → LearningProgress model
# taught_content: list[dict] = []    # → TaughtContent model
# noteachllm_registry: list[dict] = [] # → NoTeachLLM model
# backendless_projects: list[dict] = [] # → BackendlessProject model

# Static files directory for backendless projects
STATIC_DIR = Path("static_projects")
STATIC_DIR.mkdir(exist_ok=True)

blog_posts_data: list[dict] = [
    {
        "id": 1,
        "title": "Why Spec-First Development Changes Everything",
        "excerpt": "How the SpecifyKit methodology transformed my approach to building AI applications.",
        "content": "Full article content coming soon...",
        "date": "Feb 2026",
        "read_time": "5 min",
        "tags": ["SpecifyKit", "Methodology", "AI"],
        "slug": "spec-first-development",
        "featured": True,
    },
    {
        "id": 2,
        "title": "Building RAG Chatbots: Lessons from Panaversity Hackathon",
        "excerpt": "Deep dive into building a comprehensive textbook platform with RAG chatbot.",
        "content": "Full article content coming soon...",
        "date": "Jan 2026",
        "read_time": "8 min",
        "tags": ["RAG", "Hackathon", "Python"],
        "slug": "rag-chatbot-hackathon",
        "featured": True,
    },
    {
        "id": 3,
        "title": "Learning from AI Mistakes: A New Paradigm",
        "excerpt": "Exploring an innovative approach — embracing AI errors as learning opportunities.",
        "content": "Full article content coming soon...",
        "date": "Jan 2026",
        "read_time": "6 min",
        "tags": ["AI Research", "Innovation"],
        "slug": "learning-from-ai-mistakes",
        "featured": False,
    },
    {
        "id": 4,
        "title": "Next.js + FastAPI: The Ultimate Full-Stack Combo",
        "excerpt": "My go-to architecture for production AI apps and how to set it up.",
        "content": "Full article content coming soon...",
        "date": "Dec 2025",
        "read_time": "10 min",
        "tags": ["Next.js", "FastAPI", "Full-Stack"],
        "slug": "nextjs-fastapi-combo",
        "featured": False,
    },
    {
        "id": 5,
        "title": "MCP Servers: Supercharging Claude Desktop",
        "excerpt": "How I configured MCP servers to enhance my AI development workflow.",
        "content": "Full article content coming soon...",
        "date": "Dec 2025",
        "read_time": "7 min",
        "tags": ["MCP", "Claude", "Productivity"],
        "slug": "mcp-servers-claude",
        "featured": False,
    },
    {
        "id": 6,
        "title": "From Student to Agentic AI Developer: My Journey",
        "excerpt": "The path from learning basics to building autonomous AI agents.",
        "content": "Full article content coming soon...",
        "date": "Nov 2025",
        "read_time": "12 min",
        "tags": ["Career", "Agentic AI", "Journey"],
        "slug": "student-to-ai-developer",
        "featured": False,
    },
]


# ─── Helper Functions ─────────────────────────────────────────────────────────
async def send_discord_notification(contact: ContactRequest) -> None:
    """Send a Discord webhook notification when someone submits the contact form."""
    if not DISCORD_WEBHOOK_URL:
        logger.warning("Discord webhook URL not configured")
        return

    embed = {
        "title": f"📬 New Contact: {contact.subject}",
        "description": contact.message[:500],
        "color": 0x9CE630,
        "fields": [
            {"name": "👤 Name", "value": contact.name, "inline": True},
            {"name": "📧 Email", "value": contact.email, "inline": True},
            {"name": "📝 Subject", "value": contact.subject, "inline": False},
        ],
        "footer": {"text": "Asadullah.dev Portfolio"},
        "timestamp": datetime.utcnow().isoformat(),
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(DISCORD_WEBHOOK_URL, json={"embeds": [embed]})
            response.raise_for_status()
            logger.info(f"Discord notification sent for contact from {contact.name}")
    except httpx.HTTPError as e:
        logger.error(f"Discord webhook error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error sending Discord notification: {e}")


# ─── Exception Handlers ───────────────────────────────────────────────────────
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP {exc.status_code}: {exc.detail} - Path: {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc} - Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "status_code": 500},
    )


# ─── Middleware ───────────────────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests for debugging and monitoring."""
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response


# ─── Routes ───────────────────────────────────────────────────────────────────

# Health Check
@app.get("/", response_model=HealthResponse, tags=["Health"])
async def root():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="2.1.0",
        timestamp=datetime.utcnow().isoformat(),
        environment="production" if ANTHROPIC_API_KEY else "development",
    )


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health():
    """Detailed health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="2.1.0",
        timestamp=datetime.utcnow().isoformat(),
        environment="production" if ANTHROPIC_API_KEY else "development",
    )


# ─── Contact ──────────────────────────────────────────────────────────────────
@app.post("/api/contact", response_model=ContactResponse, tags=["Contact"])
@limiter.limit("5/minute")  # Rate limit: 5 submissions per minute
async def submit_contact(
    request: Request,
    contact: ContactRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Receive a contact form submission.

    - **Validates** input via Pydantic
    - **Stores** the message in database
    - **Sends** Discord notification in background (if webhook configured)
    - **Rate Limited**: 5 submissions per minute per IP

    Returns success message to the user.
    """
    # Save to database
    db_message = ContactMessage(
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send Discord notification
    background_tasks.add_task(send_discord_notification, contact)
    logger.info(f"📬 Contact from {contact.name} <{contact.email}>: {contact.subject}")

    return ContactResponse(
        success=True,
        message="Message received! I'll get back to you soon.",
    )


@app.get("/api/contact/messages", tags=["Contact"])
async def get_messages(db: Session = Depends(get_db)):
    """
    Get all contact messages from database.

    ⚠️ **Security Warning**: Add authentication before exposing in production.
    """
    messages = db.query(ContactMessage).order_by(ContactMessage.timestamp.desc()).all()
    return {
        "messages": [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "subject": m.subject,
                "message": m.message,
                "timestamp": m.timestamp.isoformat(),
                "read": m.read,
                "responded": m.responded,
            }
            for m in messages
        ],
        "total": len(messages),
    }


# ─── Blog ─────────────────────────────────────────────────────────────────────
@app.get("/api/blog", response_model=list[BlogPost], tags=["Blog"])
async def get_blog_posts(featured: Optional[bool] = None, limit: Optional[int] = None):
    """
    Get all blog posts.

    - `featured`: Optionally filter by featured=true/false
    - `limit`: Limit the number of results (default: all)
    """
    posts = blog_posts_data
    if featured is not None:
        posts = [p for p in posts if p["featured"] == featured]
    if limit:
        posts = posts[:limit]
    return posts


@app.get("/api/blog/{slug}", response_model=BlogPost, tags=["Blog"])
async def get_blog_post(slug: str):
    """Get a single blog post by its slug."""
    post = next((p for p in blog_posts_data if p["slug"] == slug), None)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


# ─── GitHub Stats ─────────────────────────────────────────────────────────────
@app.get("/api/github/stats", response_model=GitHubStats, tags=["GitHub"])
async def get_github_stats():
    """
    Proxy GitHub profile stats.

    Avoids rate-limit issues on the frontend and keeps the token server-side.
    Uses GITHUB_TOKEN env var for higher rate limits if available.
    """
    try:
        headers = {"Accept": "application/vnd.github.v3+json"}
        github_token = os.getenv("GITHUB_TOKEN", "")
        if github_token:
            headers["Authorization"] = f"token {github_token}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch user profile
            user_res = await client.get(
                f"https://api.github.com/users/{GITHUB_USERNAME}",
                headers=headers,
            )
            user_res.raise_for_status()
            user_data = user_res.json()

            # Fetch repos to calculate stars
            repos_res = await client.get(
                f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100",
                headers=headers,
            )
            repos_res.raise_for_status()
            repos_data = repos_res.json()

        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_data)

        # Calculate top languages
        lang_count: dict[str, int] = {}
        for repo in repos_data:
            lang = repo.get("language")
            if lang:
                lang_count[lang] = lang_count.get(lang, 0) + 1
        top_languages = sorted(lang_count, key=lang_count.get, reverse=True)[:5]  # type: ignore

        return GitHubStats(
            public_repos=user_data.get("public_repos", 0),
            followers=user_data.get("followers", 0),
            following=user_data.get("following", 0),
            total_stars=total_stars,
            top_languages=top_languages,
        )

    except httpx.HTTPStatusError as e:
        logger.error(f"GitHub API error: {e.response.status_code}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"GitHub API error: {e.response.text}",
        )
    except httpx.RequestError as e:
        logger.error(f"GitHub request error: {e}")
        raise HTTPException(status_code=503, detail="GitHub API unavailable")
    except Exception as e:
        logger.error(f"Failed to fetch GitHub stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch GitHub stats: {str(e)}")


# ─── LangGraph Agent ──────────────────────────────────────────────────────────
class AgentRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "message": "What are Asadullah's main skills?",
                "session_id": "user-123",
            }
        }


class AgentResponse(BaseModel):
    answer: str
    mode: str  # "langgraph" or "static"
    session_id: Optional[str] = None
    confidence: Optional[float] = None


class ErrorSolverRequest(BaseModel):
    error_message: str
    code_snippet: Optional[str] = None
    language: Optional[str] = "python"
    context: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "error_message": "TypeError: 'int' object is not iterable",
                "code_snippet": "for i in 5:\n    print(i)",
                "language": "python",
                "context": "Trying to loop through a number",
            }
        }


class ErrorSolverResponse(BaseModel):
    explanation: str
    solution: str
    corrected_code: Optional[str] = None
    confidence: float


class LearnRequest(BaseModel):
    topic: str
    level: Optional[str] = "beginner"  # beginner, intermediate, advanced
    learning_style: Optional[str] = "interactive"  # interactive, visual, theoretical
    questions: Optional[List[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "topic": "Machine Learning",
                "level": "beginner",
                "learning_style": "interactive",
                "questions": ["What is ML?", "How does neural network work?"],
            }
        }


class LearnResponse(BaseModel):
    lesson_plan: str
    resources: List[str]
    quiz_questions: List[str]
    next_steps: str


class TeachRequest(BaseModel):
    topic: str
    content: str
    difficulty: Optional[str] = "intermediate"
    examples: Optional[List[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "topic": "FastAPI Dependency Injection",
                "content": "Dependency injection is a technique for providing dependencies to functions.",
                "difficulty": "intermediate",
                "examples": ["def get_db(): ...", "async def get_current_user(): ..."],
            }
        }


class TeachResponse(BaseModel):
    acknowledgment: str
    structured_content: str
    suggested_exercises: List[str]
    related_topics: List[str]


class VideoUpload(BaseModel):
    id: int
    title: str
    description: str
    uploader: str
    upload_date: str
    file_path: str
    thumbnail: Optional[str] = None
    duration: Optional[str] = None
    tags: List[str] = []


class VideoUploadResponse(BaseModel):
    success: bool
    message: str
    video: Optional[VideoUpload] = None


class NoTeachLLMRequest(BaseModel):
    user_id: Optional[str] = None
    email: Optional[EmailStr] = None
    reason: Optional[str] = None
    scope: Optional[str] = "all"  # all, learning, teaching, analytics

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "email": "user@example.com",
                "reason": "Privacy concerns",
                "scope": "all",
            }
        }


class NoTeachLLMResponse(BaseModel):
    success: bool
    message: str
    opt_out_id: str
    scope: str
    timestamp: str


class BackendlessProject(BaseModel):
    id: int
    name: str
    description: str
    framework: str  # nextjs, react, vue, angular, static
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    tech_stack: List[str] = []
    features: List[str] = []
    screenshots: List[str] = []
    created_date: str
    updated_date: str


class BackendlessProjectCreate(BaseModel):
    name: str
    description: str
    framework: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    tech_stack: List[str] = []
    features: List[str] = []


class BackendlessProjectResponse(BaseModel):
    success: bool
    message: str
    project: Optional[BackendlessProject] = None


@app.post("/api/agent/chat", response_model=AgentResponse, tags=["Agent"])
async def agent_chat(request: AgentRequest):
    """
    Portfolio AI assistant powered by LangGraph.

    - If **ANTHROPIC_API_KEY** is set: uses Claude + LangGraph tool-calling agent
    - Otherwise: falls back to static portfolio responses (no API key required)

    Try asking:
    - "What are Asadullah's skills?"
    - "Tell me about his projects"
    - "How can I contact him?"
    """
    result = await run_agent(request.message)
    return AgentResponse(
        answer=result["answer"],
        mode=result.get("mode", "static"),
        session_id=request.session_id,
        confidence=0.95 if result.get("mode") == "langgraph" else 0.7,
    )


@app.get("/api/agent/info", tags=["Agent"])
async def agent_info():
    """Information about the portfolio agent setup."""
    has_key = bool(ANTHROPIC_API_KEY)
    try:
        import langgraph  # noqa
        lg_available = True
    except ImportError:
        lg_available = False

    mode = "langgraph" if (has_key and lg_available) else "static"
    logger.info(f"Agent mode: {mode}")

    return {
        "agent_type": "LangGraph StateGraph with tool-calling",
        "llm": "claude-haiku-4-5-20251001 (Anthropic)",
        "tools": ["get_portfolio_info"],
        "langgraph_installed": lg_available,
        "llm_configured": has_key,
        "mode": mode,
        "fallback": "Static portfolio responses when LLM not configured",
    }


# ─── Error Solver Agent ───────────────────────────────────────────────────────
@app.post("/api/agent/solve-error", response_model=ErrorSolverResponse, tags=["Agent"])
async def solve_error(request: ErrorSolverRequest):
    """
    AI-powered error solver agent.
    
    Analyzes coding errors and provides:
    - Clear explanation of what went wrong
    - Step-by-step solution
    - Corrected code snippet
    """
    result = await run_error_solver_agent(
        error_message=request.error_message,
        code_snippet=request.code_snippet,
        language=request.language,
        context=request.context,
    )
    return ErrorSolverResponse(**result)


# ─── Learning Features ────────────────────────────────────────────────────────
@app.post("/api/learn", response_model=LearnResponse, tags=["Learning"])
async def learn_topic(request: LearnRequest):
    """
    Learn through LLM - Get personalized lessons on any topic.
    
    The AI creates:
    - Customized lesson plan based on level and learning style
    - Recommended resources
    - Quiz questions to test understanding
    - Next steps for continued learning
    """
    result = await run_learning_agent(
        topic=request.topic,
        level=request.level,
        learning_style=request.learning_style,
        questions=request.questions,
    )
    
    # Save learning progress
    learning_progress.append({
        "id": len(learning_progress) + 1,
        "topic": request.topic,
        "level": request.level,
        "timestamp": datetime.utcnow().isoformat(),
    })
    
    return LearnResponse(**result)


@app.get("/api/learn/progress", tags=["Learning"])
async def get_learning_progress():
    """Get user's learning progress history."""
    return {"progress": learning_progress, "total": len(learning_progress)}


# ─── Teaching Features ────────────────────────────────────────────────────────
@app.post("/api/teach", response_model=TeachResponse, tags=["Learning"])
async def teach_topic(request: TeachRequest):
    """
    Teach to LLM - Contribute knowledge to the AI system.
    
    Submit educational content that will be:
    - Structured and organized
    - Enhanced with exercises
    - Linked to related topics
    """
    result = await run_teaching_agent(
        topic=request.topic,
        content=request.content,
        difficulty=request.difficulty,
        examples=request.examples,
    )
    
    # Save taught content
    taught_content.append({
        "id": len(taught_content) + 1,
        "topic": request.topic,
        "content": request.content,
        "difficulty": request.difficulty,
        "timestamp": datetime.utcnow().isoformat(),
    })
    
    return TeachResponse(**result)


@app.get("/api/teach/content", tags=["Learning"])
async def get_taught_content(topic: Optional[str] = None):
    """Get all user-contributed teaching content."""
    content = taught_content
    if topic:
        content = [c for c in content if topic.lower() in c["topic"].lower()]
    return {"content": content, "total": len(content)}


# ─── Video Upload ─────────────────────────────────────────────────────────────
@app.post("/api/video/upload", response_model=VideoUploadResponse, tags=["Video"])
@limiter.limit("10/minute")  # Rate limit: 10 uploads per minute
async def upload_video(
    request: Request,
    title: str = Form(...),
    description: str = Form(...),
    tags: str = Form(""),
    uploader: str = Form("Anonymous"),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Upload a video to the platform.

    Accepts video files and metadata. In production, this would store
    the file in cloud storage (S3, etc.) and save metadata to database.
    
    Rate Limited: 10 uploads per minute per IP
    """
    try:
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

        # Save file (in production, upload to S3/cloud storage)
        file_path = f"/uploads/{file.filename}" if file else "/uploads/placeholder.mp4"
        if file:
            file_path = STATIC_DIR / file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        # Save to database
        db_video = create_video(
            db=db,
            title=title,
            description=description,
            file_path=str(file_path),
            uploader=uploader,
            tags=tag_list,
        )

        logger.info(f"📹 Video uploaded: {title} by {uploader}")

        return VideoUploadResponse(
            success=True,
            message="Video uploaded successfully!",
            video=VideoUpload(
                id=db_video.id,
                title=db_video.title,
                description=db_video.description,
                uploader=db_video.uploader,
                upload_date=db_video.upload_date.isoformat(),
                file_path=db_video.file_path,
                thumbnail=db_video.thumbnail,
                duration=db_video.duration,
                tags=db_video.tags,
            ),
        )
    except Exception as e:
        logger.error(f"Video upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/video/list", response_model=List[VideoUpload], tags=["Video"])
async def list_videos(tag: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all uploaded videos, optionally filtered by tag."""
    videos = get_videos(db, tag=tag)
    return [
        VideoUpload(
            id=v.id,
            title=v.title,
            description=v.description,
            uploader=v.uploader,
            upload_date=v.upload_date.isoformat(),
            file_path=v.file_path,
            thumbnail=v.thumbnail,
            duration=v.duration,
            tags=v.tags,
        )
        for v in videos
    ]


@app.get("/api/video/{video_id}", response_model=VideoUpload, tags=["Video"])
async def get_video(video_id: int, db: Session = Depends(get_db)):
    """Get a specific video by ID."""
    video = get_video(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Increment view count
    increment_video_views(db, video_id)
    
    return VideoUpload(
        id=video.id,
        title=video.title,
        description=video.description,
        uploader=video.uploader,
        upload_date=video.upload_date.isoformat(),
        file_path=video.file_path,
        thumbnail=video.thumbnail,
        duration=video.duration,
        tags=video.tags,
    )


@app.delete("/api/video/{video_id}", tags=["Video"])
async def delete_video_endpoint(video_id: int, db: Session = Depends(get_db)):
    """Delete a video by ID."""
    success = delete_video(db, video_id)
    if not success:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"success": True, "message": "Video deleted successfully"}


# ─── NoTeachLLM - Privacy Controls ────────────────────────────────────────────
@app.post("/api/noteachllm", response_model=NoTeachLLMResponse, tags=["Privacy"])
async def opt_out_teaching(request: NoTeachLLMRequest):
    """
    NoTeachLLM - Opt out of AI training and data collection.
    
    Users can control how their data is used:
    - Opt out of having their content used for AI training
    - Control learning analytics tracking
    - Manage teaching contribution privacy
    
    Scopes:
    - all: Complete opt-out from all AI features
    - learning: Don't track learning progress
    - teaching: Don't use taught content for AI training
    - analytics: Disable analytics tracking
    """
    import uuid
    
    opt_out_id = f"opt-{uuid.uuid4().hex[:12]}"
    
    registry_entry = {
        "id": opt_out_id,
        "user_id": request.user_id,
        "email": request.email,
        "reason": request.reason,
        "scope": request.scope,
        "timestamp": datetime.utcnow().isoformat(),
        "active": True,
    }
    noteachllm_registry.append(registry_entry)
    
    logger.info(f"🔒 NoTeachLLM opt-out: {opt_out_id} (scope: {request.scope})")
    
    return NoTeachLLMResponse(
        success=True,
        message="Successfully opted out of AI training. Your preferences have been saved.",
        opt_out_id=opt_out_id,
        scope=request.scope,
        timestamp=registry_entry["timestamp"],
    )


@app.get("/api/noteachllm/status", tags=["Privacy"])
async def check_noteachllm_status(email: Optional[str] = None, user_id: Optional[str] = None):
    """Check NoTeachLLM opt-out status for a user."""
    if not email and not user_id:
        raise HTTPException(status_code=400, detail="email or user_id required")
    
    status = next(
        (
            entry for entry in noteachllm_registry
            if (email and entry.get("email") == email) or 
               (user_id and entry.get("user_id") == user_id)
        ),
        None,
    )
    
    if status:
        return {
            "opted_out": True,
            "scope": status["scope"],
            "timestamp": status["timestamp"],
            "active": status["active"],
        }
    else:
        return {
            "opted_out": False,
            "message": "No opt-out record found. Your data may be used for AI training.",
        }


@app.delete("/api/noteachllm/{opt_out_id}", tags=["Privacy"])
async def revoke_opt_out(opt_out_id: str):
    """Revoke a NoTeachLLM opt-out (opt back in)."""
    global noteachllm_registry
    
    entry = next((e for e in noteachllm_registry if e["id"] == opt_out_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Opt-out record not found")
    
    noteachllm_registry = [e for e in noteachllm_registry if e["id"] != opt_out_id]
    
    return {
        "success": True,
        "message": "Opt-out revoked. You're now opted back in.",
    }


# ─── Backendless Project Support ──────────────────────────────────────────────
@app.post("/api/backendless", response_model=BackendlessProjectResponse, tags=["Backendless"])
async def create_backendless_project(project: BackendlessProjectCreate):
    """
    Create a backendless (frontend-only) project entry.
    
    For projects that don't need a backend:
    - Static sites
    - JAMstack applications
    - Frontend frameworks demos
    - Portfolio pieces
    
    These projects are showcased without backend API requirements.
    """
    project_entry = {
        "id": len(backendless_projects) + 1,
        **project.dict(),
        "screenshots": [],
        "created_date": datetime.utcnow().isoformat(),
        "updated_date": datetime.utcnow().isoformat(),
    }
    backendless_projects.append(project_entry)
    
    logger.info(f"📦 Backendless project created: {project.name} ({project.framework})")
    
    return BackendlessProjectResponse(
        success=True,
        message="Backendless project created successfully!",
        project=BackendlessProject(**project_entry),
    )


@app.get("/api/backendless", response_model=List[BackendlessProject], tags=["Backendless"])
async def list_backendless_projects(framework: Optional[str] = None):
    """List all backendless projects, optionally filtered by framework."""
    projects = backendless_projects
    if framework:
        projects = [p for p in projects if p["framework"].lower() == framework.lower()]
    return projects


@app.get("/api/backendless/{project_id}", response_model=BackendlessProject, tags=["Backendless"])
async def get_backendless_project(project_id: int):
    """Get a specific backendless project by ID."""
    project = next((p for p in backendless_projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.put("/api/backendless/{project_id}", response_model=BackendlessProject, tags=["Backendless"])
async def update_backendless_project(project_id: int, updates: Dict[str, Any]):
    """Update a backendless project."""
    global backendless_projects
    
    project = next((p for p in backendless_projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update allowed fields
    allowed_fields = ["name", "description", "github_url", "demo_url", "tech_stack", "features"]
    for field, value in updates.items():
        if field in allowed_fields:
            project[field] = value
    
    project["updated_date"] = datetime.utcnow().isoformat()
    
    return BackendlessProject(**project)


@app.delete("/api/backendless/{project_id}", tags=["Backendless"])
async def delete_backendless_project(project_id: int):
    """Delete a backendless project."""
    global backendless_projects
    project = next((p for p in backendless_projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    backendless_projects = [p for p in backendless_projects if p["id"] != project_id]
    return {"success": True, "message": "Project deleted successfully"}


@app.post("/api/backendless/{project_id}/upload", tags=["Backendless"])
async def upload_backendless_project(
    project_id: int,
    file: UploadFile = File(...),
):
    """
    Upload static files for a backendless project.
    
    Accepts ZIP files containing built static sites (HTML, CSS, JS).
    Files are extracted and served statically.
    """
    project = next((p for p in backendless_projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Create project directory
    project_dir = STATIC_DIR / f"project_{project_id}"
    project_dir.mkdir(exist_ok=True)
    
    # Save the uploaded file
    file_path = project_dir / file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # If it's a zip, extract it
        if file.filename.endswith(".zip"):
            import zipfile
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(project_dir)
            file_path.unlink()  # Remove zip after extraction
        
        logger.info(f"📦 Uploaded backendless project files for: {project['name']}")
        
        return {
            "success": True,
            "message": "Project files uploaded successfully",
            "path": str(project_dir),
        }
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/backendless/{project_id}/serve/{path:path}", tags=["Backendless"])
async def serve_backendless_project(project_id: int, path: str):
    """Serve static files for a backendless project."""
    project_dir = STATIC_DIR / f"project_{project_id}"
    
    if not project_dir.exists():
        raise HTTPException(status_code=404, detail="Project files not found")
    
    file_path = project_dir / path
    
    # Security: Ensure path is within project directory
    try:
        file_path.resolve().relative_to(project_dir.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not file_path.exists():
        # Try index.html for root
        if path == "" or path.endswith("/"):
            file_path = project_dir / "index.html"
        else:
            raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)


# ─── API Info ─────────────────────────────────────────────────────────────────
@app.get("/api", tags=["Info"], summary="API Information")
async def api_info():
    """Get API information and available endpoints."""
    return {
        "name": "Asadullah.dev Portfolio API",
        "version": "2.3.0",
        "description": "Backend API for Asadullah Shafique's portfolio",
        "features": [
            "Contact & Blog API",
            "GitHub Stats",
            "AI Agents (Chat, Error Solver, Learn, Teach)",
            "Video Upload & Management",
            "NoTeachLLM Privacy Controls",
            "Backendless Project Support",
            "MCP Server Integration",
        ],
        "endpoints": {
            "health": "/health",
            "contact": "/api/contact",
            "blog": "/api/blog",
            "github": "/api/github/stats",
            "agent_chat": "/api/agent/chat",
            "agent_solve_error": "/api/agent/solve-error",
            "learn": "/api/learn",
            "teach": "/api/teach",
            "video": "/api/video",
            "noteachllm": "/api/noteachllm",
            "backendless": "/api/backendless",
            "mcp": "/mcp",
            "docs": "/docs",
        },
        "documentation": "/docs",
    }
