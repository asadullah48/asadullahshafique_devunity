"""
Portfolio knowledge — single source of truth (Python side)
==========================================================
Loads `portfolio.json` and exposes it in the shapes the existing callers already
expect, so adopting it is a definition swap rather than a rewrite.

    from knowledge import PORTFOLIO_DATA, MCP_TOOL_RESULTS

Before this module there were three copies of these facts — `PORTFOLIO_DATA` in
agent.py, `TOOL_RESULTS` in mcp_server.py, and `PORTFOLIO_FACTS` in
src/lib/agent-knowledge.ts — and all three had drifted apart. Add a consumer
here; never add a fourth copy. See CLAUDE.md section 0.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

_SOURCE = Path(__file__).parent / "portfolio.json"

with _SOURCE.open(encoding="utf-8") as fh:
    _RAW: dict[str, Any] = json.load(fh)

# `_README` is documentation for humans editing the JSON; it is not data.
PORTFOLIO: dict[str, Any] = {k: v for k, v in _RAW.items() if not k.startswith("_")}

_IDENTITY = PORTFOLIO["identity"]
_CONTACT = PORTFOLIO["contact"]
_SKILLS = PORTFOLIO["skills"]
_PROJECTS = PORTFOLIO["projects"]
_HACKATHONS = PORTFOLIO["hackathons"]
_AGENT_ENG = PORTFOLIO["agentEngineering"]


def _flat_skills() -> list[str]:
    """Every skill as one ordered list, de-duplicated, order preserved."""
    ordered: list[str] = []
    for group in ("languages", "frameworks", "data", "ai", "devops"):
        for skill in _SKILLS.get(group, []):
            if skill not in ordered:
                ordered.append(skill)
    return ordered


def _project_type(project: dict[str, Any]) -> str:
    """A short human label. Hackathon entries name the hackathon."""
    if project.get("hackathon"):
        return f"Hackathon {project['hackathon']}"
    return str(project.get("status", "")).capitalize()


def _hackathon_lines() -> list[str]:
    """['H0 — Bronze', 'H1 — Silver', ...] — callers join these with ', '."""
    return [f"{r['id']} — {r['result']}" for r in _HACKATHONS["results"]]


# ─── Compatibility shape for agent.py ────────────────────────────────────────
# Keys here are exactly the ones agent.py already reads. Removing one breaks it.
PORTFOLIO_DATA: dict[str, Any] = {
    "name": _IDENTITY["name"],
    "github": _CONTACT["github"],
    "discord": _CONTACT["discord"],
    "email": _CONTACT["email"],
    "skills": _flat_skills(),
    "focus": _IDENTITY["focus"],
    "projects": [
        {
            "name": p["name"],
            "tech": p["tech"],
            "type": _project_type(p),
            "description": p["summary"],
        }
        for p in _PROJECTS
    ],
    "hackathons": _hackathon_lines(),
    "education": _IDENTITY["education"],
    "interests": _SKILLS["ai"] + ["Full-stack development"],
}


# ─── Compatibility shape for mcp_server.py ───────────────────────────────────
MCP_TOOL_RESULTS: dict[str, Any] = {
    "get_skills": {
        "languages": _SKILLS["languages"],
        "frameworks": _SKILLS["frameworks"],
        "data": _SKILLS["data"],
        "ai_tools": _SKILLS["ai"],
        "devops": _SKILLS["devops"],
        "methodology": _SKILLS["methodology"],
    },
    "get_projects": [
        {
            "name": p["name"],
            "type": _project_type(p),
            "tech": p["tech"],
            "description": p["summary"],
            "metrics": p.get("metrics", []),
        }
        for p in _PROJECTS
    ],
    "get_contact": dict(_CONTACT),
    "get_about": {
        "name": _IDENTITY["name"],
        "roles": _IDENTITY["roles"],
        "location": _IDENTITY["location"],
        "tagline": _IDENTITY["tagline"],
        "focus": _IDENTITY["focus"],
        "education": _IDENTITY["education"],
        "github_handle": _CONTACT["github"].rsplit("/", 1)[-1],
    },
    "get_hackathons": {
        "summary": _HACKATHONS["summary"],
        "results": _HACKATHONS["results"],
        "methodology": _HACKATHONS["methodology"],
    },
    "get_agent_engineering": {
        "summary": _AGENT_ENG["summary"],
        "disciplines": _AGENT_ENG["disciplines"],
    },
}


__all__ = ["PORTFOLIO", "PORTFOLIO_DATA", "MCP_TOOL_RESULTS"]
