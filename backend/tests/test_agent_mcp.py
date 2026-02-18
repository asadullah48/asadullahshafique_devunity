# Agent and MCP Tests
# ====================
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch


class TestAgentEndpoint:
    """Test AI agent chat endpoint."""

    def test_agent_chat_static_mode(self, client: TestClient):
        """Test agent chat in static mode (no API key)."""
        data = {"message": "What are Asadullah's skills?"}
        response = client.post("/api/agent/chat", json=data)
        
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert "mode" in data
        assert data["mode"] in ["langgraph", "static"]

    def test_agent_chat_with_session(self, client: TestClient):
        """Test agent chat with session ID."""
        data = {
            "message": "Tell me about the projects",
            "session_id": "test-session-123",
        }
        response = client.post("/api/agent/chat", json=data)
        
        assert response.status_code == 200
        result = response.json()
        assert result["session_id"] == "test-session-123"

    def test_agent_empty_message(self, client: TestClient):
        """Test agent chat with empty message."""
        data = {"message": ""}
        response = client.post("/api/agent/chat", json=data)
        
        # Should still return a response
        assert response.status_code == 200

    @patch("agent.LANGGRAPH_AVAILABLE", False)
    def test_agent_fallback_static(self, client: TestClient):
        """Test agent falls back to static mode when LangGraph unavailable."""
        data = {"message": "Test message"}
        response = client.post("/api/agent/chat", json=data)
        
        assert response.status_code == 200
        result = response.json()
        assert result["mode"] == "static"


class TestAgentInfo:
    """Test agent info endpoint."""

    def test_agent_info(self, client: TestClient):
        """Test retrieving agent configuration info."""
        response = client.get("/api/agent/info")
        
        assert response.status_code == 200
        data = response.json()
        assert "agent_type" in data
        assert "mode" in data
        assert "langgraph_installed" in data
        assert "llm_configured" in data

    def test_agent_info_mode(self, client: TestClient):
        """Test that agent mode is correctly reported."""
        response = client.get("/api/agent/info")
        data = response.json()
        
        # Mode should match configuration
        if data["llm_configured"] and data["langgraph_installed"]:
            assert data["mode"] == "langgraph"
        else:
            assert data["mode"] == "static"


class TestMCPEndpoints:
    """Test MCP server endpoints."""

    def test_mcp_info(self, client: TestClient):
        """Test MCP info endpoint."""
        response = client.get("/mcp/")
        
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "endpoint" in data

    def test_mcp_list_tools(self, client: TestClient):
        """Test listing MCP tools."""
        response = client.get("/mcp/tools")
        
        assert response.status_code == 200
        data = response.json()
        assert "tools" in data
        assert "count" in data
        assert len(data["tools"]) > 0

    def test_mcp_get_skills(self, client: TestClient):
        """Test getting skills via MCP tool."""
        response = client.get("/mcp/tools/get_skills")
        
        assert response.status_code == 200
        data = response.json()
        assert "tool" in data
        assert "result" in data
        assert data["tool"] == "get_skills"

    def test_mcp_get_projects(self, client: TestClient):
        """Test getting projects via MCP tool."""
        response = client.get("/mcp/tools/get_projects")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["result"], list)

    def test_mcp_get_contact(self, client: TestClient):
        """Test getting contact info via MCP tool."""
        response = client.get("/mcp/tools/get_contact")
        
        assert response.status_code == 200
        data = response.json()
        assert "email" in data["result"]
        assert "github" in data["result"]

    def test_mcp_nonexistent_tool(self, client: TestClient):
        """Test calling non-existent MCP tool."""
        response = client.get("/mcp/tools/nonexistent_tool")
        
        assert response.status_code == 404

    def test_mcp_rpc_tools_list(self, client: TestClient):
        """Test MCP JSON-RPC tools/list method."""
        data = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list",
            "params": {},
        }
        response = client.post("/mcp/rpc", json=data)
        
        assert response.status_code == 200
        result = response.json()
        assert result["jsonrpc"] == "2.0"
        assert result["id"] == 1
        assert "result" in result

    def test_mcp_rpc_unknown_method(self, client: TestClient):
        """Test MCP JSON-RPC with unknown method."""
        data = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "unknown/method",
            "params": {},
        }
        response = client.post("/mcp/rpc", json=data)
        
        assert response.status_code == 200
        result = response.json()
        assert "error" in result
