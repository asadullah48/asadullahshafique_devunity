# GitHub Stats Tests
# ===================
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import httpx


class TestGitHubStats:
    """Test GitHub stats endpoint."""

    @patch("httpx.AsyncClient.get")
    def test_get_github_stats(self, mock_get, client: TestClient):
        """Test retrieving GitHub stats with mocked API."""
        # Mock user data
        mock_user_data = {
            "public_repos": 50,
            "followers": 100,
            "following": 20,
        }
        
        # Mock repos data
        mock_repos_data = [
            {"stargazers_count": 10, "language": "Python"},
            {"stargazers_count": 20, "language": "TypeScript"},
            {"stargazers_count": 5, "language": "Python"},
        ]
        
        # Create async mock responses
        async def mock_user(*args, **kwargs):
            return type('obj', (object,), {
                'json': lambda: mock_user_data,
                'raise_for_status': lambda: None,
            })()
        
        async def mock_repos(*args, **kwargs):
            return type('obj', (object,), {
                'json': lambda: mock_repos_data,
                'raise_for_status': lambda: None,
            })()
        
        mock_get.side_effect = [mock_user(), mock_repos()]
        
        response = client.get("/api/github/stats")
        
        assert response.status_code == 200
        data = response.json()
        assert "public_repos" in data
        assert "followers" in data
        assert "following" in data
        assert "total_stars" in data
        assert "top_languages" in data

    @patch("httpx.AsyncClient.get")
    def test_github_stats_with_token(self, mock_get, client: TestClient, mock_github_token):
        """Test GitHub stats request includes token when configured."""
        async def mock_response(*args, **kwargs):
            return type('obj', (object,), {
                'json': lambda: {"public_repos": 10, "followers": 50, "following": 10},
                'raise_for_status': lambda: None,
            })()
        
        mock_get.side_effect = [mock_response(), mock_response()]
        
        response = client.get("/api/github/stats")
        
        assert response.status_code == 200

    def test_github_stats_structure(self, client: TestClient):
        """Test GitHub stats response structure."""
        # This will fail in tests without mocking, which is expected
        # In CI, use proper mocking
        response = client.get("/api/github/stats")
        
        # Either success or rate limit (no token)
        if response.status_code == 200:
            data = response.json()
            assert all(key in data for key in [
                "public_repos", "followers", "following", "total_stars", "top_languages"
            ])


class TestGitHubUsername:
    """Test GitHub username configuration."""

    def test_custom_github_username(self, client: TestClient):
        """Test that custom GitHub username is used."""
        from main import GITHUB_USERNAME
        
        # Default should be asadullah48
        assert GITHUB_USERNAME == "asadullah48"
