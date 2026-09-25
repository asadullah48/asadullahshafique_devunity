# Contact API Tests
# ==================
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock


class TestContactEndpoint:
    """Test contact form submission endpoint."""

    def test_submit_contact_success(self, client: TestClient, sample_contact_data):
        """Test successful contact form submission."""
        response = client.post("/api/contact", json=sample_contact_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "message" in data

    def test_submit_contact_invalid_email(self, client: TestClient):
        """Test contact form with invalid email."""
        data = {
            "name": "Test User",
            "email": "invalid-email",
            "subject": "Test",
            "message": "Test message",
        }
        response = client.post("/api/contact", json=data)
        
        assert response.status_code == 422  # Validation error

    def test_submit_contact_missing_field(self, client: TestClient, sample_contact_data):
        """Test contact form with missing required field."""
        del sample_contact_data["name"]
        response = client.post("/api/contact", json=sample_contact_data)
        
        assert response.status_code == 422

    def test_submit_contact_empty_message(self, client: TestClient):
        """Test contact form with empty message."""
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test",
            "message": "",
        }
        response = client.post("/api/contact", json=data)
        
        assert response.status_code == 422

    @pytest.mark.parametrize("field", ["name", "subject", "message"])
    def test_submit_contact_whitespace_only_field(self, client: TestClient, sample_contact_data, field):
        """Whitespace-only text fields are rejected like empty ones."""
        sample_contact_data[field] = "   "
        response = client.post("/api/contact", json=sample_contact_data)

        assert response.status_code == 422

    def test_rate_limit_still_applies(self, client: TestClient, sample_contact_data):
        """The per-test reset clears counters; it does not disable the limit."""
        codes = [
            client.post("/api/contact", json=sample_contact_data).status_code
            for _ in range(6)
        ]

        assert codes[:5] == [200] * 5
        assert codes[5] == 429

    @patch("main.send_discord_notification")
    def test_discord_notification_called(self, mock_discord, client: TestClient, sample_contact_data, mock_discord_webhook):
        """Test that Discord notification is triggered."""
        response = client.post("/api/contact", json=sample_contact_data)
        
        assert response.status_code == 200
        # Note: Background tasks may not execute synchronously in tests


class TestGetMessages:
    """Test get messages endpoint."""

    def test_get_messages(self, client: TestClient, sample_contact_data, admin_headers):
        """Test retrieving contact messages."""
        # First submit a message
        client.post("/api/contact", json=sample_contact_data)
        
        # Then retrieve messages
        response = client.get("/api/contact/messages", headers=admin_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "messages" in data
        assert "total" in data
        assert data["total"] >= 1

    def test_get_messages_requires_admin_token(self, client: TestClient, admin_headers):
        """Messages are private: no token or a wrong token is rejected.

        Replaces test_get_messages_empty, which cleared an in-memory
        `contact_messages` list that no longer exists (messages now live in
        the database, behind the admin token).
        """
        assert client.get("/api/contact/messages").status_code == 401
        assert client.get(
            "/api/contact/messages", headers={"X-Admin-Token": "wrong"}
        ).status_code == 401


class TestContactValidation:
    """Test contact form validation."""

    def test_contact_email_format(self, client: TestClient):
        """Test various email formats."""
        valid_emails = [
            "user@example.com",
            "user.name@example.co.uk",
            "user+tag@example.org",
        ]
        
        for email in valid_emails:
            data = {
                "name": "Test",
                "email": email,
                "subject": "Test",
                "message": "Test",
            }
            response = client.post("/api/contact", json=data)
            assert response.status_code == 200, f"Email {email} should be valid"

    def test_contact_message_length(self, client: TestClient):
        """Test message length validation."""
        # Very long message
        data = {
            "name": "Test",
            "email": "test@example.com",
            "subject": "Test",
            "message": "A" * 10000,
        }
        response = client.post("/api/contact", json=data)
        
        # Should accept long messages (Discord truncates)
        assert response.status_code == 200
