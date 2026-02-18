"""
MCP (Model Context Protocol) Server — Portfolio Tools
======================================================
Exposes portfolio data as MCP-compatible tools so AI assistants
(Claude Desktop, etc.) can query Asadullah's portfolio directly.

MCP spec: https://modelcontextprotocol.io
Mount these routes on the main FastAPI app under /mcp prefix.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any

router = APIRouter(prefix="/mcp", tags=["MCP"])

# ─── MCP Models (JSON-RPC 2.0 compatible) ─────────────────────────────────────
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


# ─── Tool Definitions ─────────────────────────────────────────────────────────
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
]

# ─── Tool Implementations ─────────────────────────────────────────────────────
TOOL_RESULTS = {
    "get_skills": {
        "languages": ["TypeScript", "JavaScript", "Python"],
        "frameworks": ["Next.js", "React", "FastAPI"],
        "ai_tools": ["LangGraph", "Claude API", "OpenAI API", "Gemini API", "RAG", "MCP Servers"],
        "devops": ["Docker", "GitHub Actions", "Kubernetes", "WSL/Ubuntu"],
        "methodology": "Spec-first development (SpecifyKit SDK)",
    },
    "get_projects": [
        {
            "name": "Textbook RAG Chatbot Platform",
            "type": "Hackathon (Panaversity)",
            "tech": ["Python", "FastAPI", "LangChain", "RAG", "Next.js"],
            "description": "Comprehensive textbook platform with RAG-powered AI chatbot",
        },
        {
            "name": "Asadullah.dev Portfolio",
            "type": "Production",
            "tech": ["Next.js 15", "TypeScript", "FastAPI", "Docker", "LangGraph"],
            "url": "https://asadullahshafique-devunity.vercel.app",
        },
        {
            "name": "Agentic AI Systems",
            "type": "Research & Development",
            "tech": ["LangGraph", "Claude API", "SpecifyKit SDK", "Python"],
        },
        {
            "name": "MCP Server Integrations",
            "type": "Tooling",
            "tech": ["TypeScript", "MCP", "Claude Desktop"],
        },
    ],
    "get_contact": {
        "email": "asadullahshafique@hotmail.com",
        "github": "https://github.com/asadullah48",
        "discord": "https://discord.gg/kXfEYVGX",
        "portfolio": "https://asadullahshafique-devunity.vercel.app",
    },
    "get_about": {
        "name": "Asadullah Shafique",
        "role": "Agentic AI Developer & Full-Stack Engineer",
        "github_handle": "asadullah48",
        "education": "Student at Panaversity — Agentic AI development track",
        "focus": "Building production-ready agentic AI systems with spec-first methodology",
        "location": "Pakistan (Windows 11 + Ubuntu WSL)",
        "philosophy": "Learning from AI mistakes rather than avoiding them — innovative AI paradigms",
    },
    "get_hackathons": [
        {
            "name": "Panaversity Physical AI & Humanoid Robotics Hackathon",
            "year": "2025-2026",
            "project": "Comprehensive Textbook Platform with RAG Chatbot",
            "methodology": "Spec-Kit Plus (specification-first development)",
            "tech": ["Python", "FastAPI", "RAG", "LangChain", "Next.js"],
            "status": "Completed",
        }
    ],
}


# ─── MCP Routes ───────────────────────────────────────────────────────────────
@router.get("/", summary="MCP server info")
async def mcp_info():
    return {
        "name": "asadullah-portfolio-mcp",
        "version": "1.0.0",
        "description": "MCP server exposing Asadullah Shafique's portfolio as AI-queryable tools",
        "protocol": "Model Context Protocol",
        "endpoint": "/mcp/rpc",
    }


@router.post("/rpc", response_model=MCPResponse, summary="MCP JSON-RPC endpoint")
async def mcp_rpc(request: MCPRequest):
    """
    MCP-compatible JSON-RPC 2.0 endpoint.
    Supported methods: tools/list, tools/call
    """
    method = request.method

    # List available tools
    if method == "tools/list":
        return MCPResponse(id=request.id, result={"tools": TOOLS})

    # Call a tool
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

    # Unknown method
    return MCPResponse(
        id=request.id,
        error={"code": -32601, "message": f"Method '{method}' not supported"},
    )


@router.get("/tools", summary="List MCP tools (REST convenience)")
async def list_tools():
    """REST-friendly way to list all available MCP tools."""
    return {"tools": TOOLS, "count": len(TOOLS)}


@router.get("/tools/{tool_name}", summary="Call an MCP tool via GET")
async def call_tool(tool_name: str):
    """REST-friendly way to call a tool by name."""
    if tool_name not in TOOL_RESULTS:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
    return {"tool": tool_name, "result": TOOL_RESULTS[tool_name]}
