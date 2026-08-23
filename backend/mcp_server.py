"""
MCP (Model Context Protocol) Server — Portfolio Tools
======================================================
This module exposes TWO surfaces. They are not the same thing, and conflating
them is what made the previous version of this file dishonest.

1. `portfolio_mcp` — a REAL MCP server built on the official SDK
   (`mcp.server.fastmcp.FastMCP`), speaking Streamable HTTP. main.py mounts it
   at /mcp/server. This is what an MCP client (Claude Desktop, the `mcp` CLI,
   any SDK client) connects to. It performs a genuine `initialize` handshake
   and serves `tools/list` / `tools/call` over the protocol.

2. `router` — a legacy REST shim at /mcp/*. It is **NOT MCP**. It is plain JSON
   over HTTP in an MCP-ish shape, and no MCP client can speak to it. It is kept
   because the README documents it and backend/tests/test_agent_mcp.py covers
   it. Do not describe it as an MCP server anywhere user-facing.

Both read their data from knowledge/portfolio.json — the single source of truth.

MCP spec: https://modelcontextprotocol.io

--- Why stateless_http=True ---
backend/Dockerfile runs `uvicorn main:app --workers 2`. Streamable HTTP session
state lives in-process, so with two workers and no sticky routing a client could
complete `initialize` on worker A and have its next request land on worker B,
which has never heard of that session. Stateless mode removes that affinity
requirement. Do not turn this off without adding a shared EventStore or sticky
sessions at the load balancer.
"""

from typing import Any

from fastapi import APIRouter
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

from knowledge import MCP_TOOL_RESULTS as TOOL_RESULTS

router = APIRouter(prefix="/mcp", tags=["MCP"])


# ─── Models (legacy shim only — the real server uses the SDK's own types) ─────
class MCPRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: int | str
    method: str
    params: dict[str, Any] = {}


class MCPResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: int | str
    result: Any = None
    error: dict | None = None


# ─── Tool Definitions (the legacy shim's advertised list) ────────────────────
TOOLS = [
    {
        "name": "get_skills",
        "description": "Get Asadullah's technical skills, languages, and frameworks",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_projects",
        "description": "Get list of Asadullah's projects with tech stack",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_contact",
        "description": "Get Asadullah's contact information (email, Discord, GitHub)",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_about",
        "description": "Get background information about Asadullah Shafique",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_hackathons",
        "description": "Get Asadullah's hackathon experience",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_agent_engineering",
        "description": "Get Asadullah's agent engineering framework: harness, loop, and graph",
        "inputSchema": {"type": "object", "properties": {}},
    },
]


# ═════════════════════════════════════════════════════════════════════════════
# THE REAL MCP SERVER
# ═════════════════════════════════════════════════════════════════════════════

portfolio_mcp = FastMCP(
    name="asadullah-portfolio",
    instructions=(
        "Tools for querying Asadullah Shafique's professional portfolio: skills, "
        "projects, hackathon results, agent engineering practice, and contact "
        "details. All tools are read-only and take no arguments. Data comes from "
        "a single curated source; if a detail is not returned by a tool, it is "
        "not claimed — do not infer or embellish."
    ),
    website_url="https://asadullahshafique-devunity.vercel.app",
    stateless_http=True,
    # main.py mounts this app at /mcp/server, so its internal route is the root.
    streamable_http_path="/",
)


@portfolio_mcp.tool()
def get_skills() -> dict[str, Any]:
    """Asadullah's technical skills: languages, frameworks, data stores, AI tooling, and DevOps."""
    return TOOL_RESULTS["get_skills"]


@portfolio_mcp.tool()
def get_projects() -> list[dict[str, Any]]:
    """Asadullah's projects, each with status, summary, tech stack, and any published metrics."""
    return TOOL_RESULTS["get_projects"]


@portfolio_mcp.tool()
def get_contact() -> dict[str, Any]:
    """How to reach Asadullah: email, WhatsApp, GitHub, Discord, and portfolio URL."""
    return TOOL_RESULTS["get_contact"]


@portfolio_mcp.tool()
def get_about() -> dict[str, Any]:
    """Background on Asadullah Shafique: roles, location, positioning, focus, and education."""
    return TOOL_RESULTS["get_about"]


@portfolio_mcp.tool()
def get_hackathons() -> dict[str, Any]:
    """Asadullah's hackathon record: six Panaversity hackathons with per-event results."""
    return TOOL_RESULTS["get_hackathons"]


@portfolio_mcp.tool()
def get_agent_engineering() -> dict[str, Any]:
    """Asadullah's agent engineering framework: the harness, loop, and graph disciplines."""
    return TOOL_RESULTS["get_agent_engineering"]


# ═════════════════════════════════════════════════════════════════════════════
# LEGACY REST SHIM — not MCP. See the module docstring.
# ═════════════════════════════════════════════════════════════════════════════


@router.get("/", summary="Portfolio tool server info")
async def mcp_info():
    return {
        "name": "asadullah-portfolio-mcp",
        "version": "2.0.0",
        "description": "Portfolio exposed as AI-queryable tools",
        "protocol": "Model Context Protocol",
        # The real, spec-compliant endpoint. The REST paths below are a
        # convenience shim and cannot complete an MCP handshake.
        "endpoint": "/mcp/server",
        "transport": "streamable-http",
        "legacy_rest_endpoints": {
            "list_tools": "/mcp/tools",
            "call_tool": "/mcp/tools/{tool_name}",
            "json_rpc": "/mcp/rpc",
        },
    }


@router.post("/rpc", response_model=MCPResponse, summary="Legacy JSON-RPC shim (not MCP)")
async def mcp_rpc(request: MCPRequest):
    """
    JSON-RPC-shaped convenience endpoint. Supports tools/list and tools/call.

    This is NOT the MCP endpoint: it performs no `initialize` handshake and no
    capability negotiation. Point MCP clients at /mcp/server instead.
    """
    method = request.method

    if method == "tools/list":
        return MCPResponse(id=request.id, result={"tools": TOOLS})

    if method == "tools/call":
        tool_name = request.params.get("name")
        if tool_name not in TOOL_RESULTS:
            return MCPResponse(
                id=request.id,
                error={"code": -32601, "message": f"Tool '{tool_name}' not found"},
            )
        return MCPResponse(
            id=request.id,
            result={"content": [{"type": "text", "text": str(TOOL_RESULTS[tool_name])}]},
        )

    return MCPResponse(
        id=request.id,
        error={"code": -32601, "message": f"Method '{method}' not supported"},
    )


@router.get("/tools", summary="List tools (REST convenience)")
async def list_tools():
    """REST-friendly way to list all available tools."""
    return {"tools": TOOLS, "count": len(TOOLS)}


@router.get("/tools/{tool_name}", summary="Call a tool via GET (REST convenience)")
async def call_tool(tool_name: str):
    """REST-friendly way to call a tool by name."""
    if tool_name not in TOOL_RESULTS:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
    return {"tool": tool_name, "result": TOOL_RESULTS[tool_name]}
