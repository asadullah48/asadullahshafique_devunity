# Health Check Tests
# ===================
import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoints:
    """Test health check endpoints."""

    def test_root_health_check(self, client: TestClient):
        """Test the root health check endpoint."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
        assert "timestamp" in data
        assert "environment" in data

    def test_health_endpoint(self, client: TestClient):
        """Test the /health endpoint."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["version"] == "2.1.0"

    def test_health_response_format(self, client: TestClient):
        """Test health endpoint response format."""
        response = client.get("/health")
        data = response.json()
        
        # Verify all required fields are present
        assert all(key in data for key in ["status", "version", "timestamp", "environment"])
        
        # Verify environment is either production or development
        assert data["environment"] in ["production", "development"]


class TestAPIInfo:
    """Test API information endpoint."""

    def test_api_info(self, client: TestClient):
        """Test the /api info endpoint."""
        response = client.get("/api")
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Asadullah.dev Portfolio API"
        assert "version" in data
        assert "endpoints" in data
        assert "documentation" in data

    def test_api_endpoints_list(self, client: TestClient):
        """Test that API endpoints are listed."""
        response = client.get("/api")
        data = response.json()
        
        endpoints = data["endpoints"]
        assert "health" in endpoints
        assert "contact" in endpoints
        assert "blog" in endpoints
        assert "github" in endpoints
        assert "agent" in endpoints
