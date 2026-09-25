"""
The real MCP server must accept requests addressed to its public host.

The SDK auto-enables DNS-rebinding protection with a localhost-only allow-list,
which made the deployed /mcp/server answer 421 to every remote client. These
tests send the Host header a real client sends through Render, and check that
protection is still on for hosts nobody configured.
"""

from fastapi.testclient import TestClient

INITIALIZE = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2025-06-18",
        "capabilities": {},
        "clientInfo": {"name": "pytest", "version": "1"},
    },
}
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
}


def _initialize(client: TestClient, host: str, **extra: str):
    return client.post(
        "/mcp/server/", json=INITIALIZE, headers={**HEADERS, "Host": host, **extra}
    )


def test_public_host_is_accepted(client: TestClient):
    response = _initialize(client, "asadullahshafique-devunity.onrender.com")
    assert response.status_code == 200
    assert '"serverInfo"' in response.text
    assert "asadullah-portfolio" in response.text


def test_localhost_is_accepted(client: TestClient):
    assert _initialize(client, "localhost:8000").status_code == 200


def test_unknown_host_is_still_rejected(client: TestClient):
    """Protection is narrowed to known hosts, not switched off."""
    assert _initialize(client, "evil.example.com").status_code == 421


def test_foreign_browser_origin_is_rejected(client: TestClient):
    response = _initialize(
        client,
        "asadullahshafique-devunity.onrender.com",
        Origin="https://evil.example.com",
    )
    assert response.status_code == 403
