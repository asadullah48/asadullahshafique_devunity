# Test fixtures and configuration
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app, limiter


@pytest.fixture(scope="session")
def client():
    """
    Test client for the FastAPI app, scoped to the whole session.

    Session scope is required, not a preference. Entering TestClient runs the
    app's lifespan, and that lifespan starts the MCP StreamableHTTPSessionManager
    (see main.py). That manager raises

        RuntimeError: StreamableHTTPSessionManager .run() can only be called
        once per instance.

    on a second run, so a function-scoped client fails every test after the
    first. One lifecycle per session also matches production, where uvicorn
    starts the app exactly once per process.
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def reset_rate_limits():
    """
    Clear slowapi's counters before every test.

    The client is session-scoped (see above), so every request comes from the
    same address and the 5/minute contact limit accumulated across tests,
    turning later submissions into 429s. Resetting the storage keeps the limit
    itself in force; test_rate_limit_still_applies proves it.
    """
    limiter.reset()
    yield


@pytest.fixture
def admin_headers():
    """X-Admin-Token header matching a patched ADMIN_SECRET."""
    with patch("main.ADMIN_SECRET", "test-admin-secret"):
        yield {"X-Admin-Token": "test-admin-secret"}


@pytest.fixture
def mock_discord_webhook():
    """Mock Discord webhook for testing."""
    with patch("main.DISCORD_WEBHOOK_URL", "https://discord.com/api/webhooks/test"):
        yield


@pytest.fixture
def mock_github_token():
    """Mock GitHub token for testing."""
    with patch.dict("os.environ", {"GITHUB_TOKEN": "test_token"}):
        yield


@pytest.fixture
def sample_contact_data():
    """Sample contact form data for testing."""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message.",
    }


@pytest.fixture
def sample_blog_post():
    """Sample blog post data for testing."""
    return {
        "id": 999,
        "title": "Test Blog Post",
        "excerpt": "Test excerpt",
        "content": "Test content",
        "date": "Jan 2026",
        "read_time": "5 min",
        "tags": ["Test", "Testing"],
        "slug": "test-blog-post",
        "featured": True,
    }
