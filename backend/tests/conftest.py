# Test fixtures and configuration
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


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
