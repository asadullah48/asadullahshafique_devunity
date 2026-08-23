"""
Agent orchestration on the OpenAI Agents SDK.

    from orchestration import run_orchestrated_chat, orchestration_status

--- Why this package is not called `agents` ---
`openai-agents` installs a TOP-LEVEL module named `agents`. Since the backend
runs with its own directory first on sys.path, a package at backend/agents/
would shadow the SDK, and `from agents import Agent` inside this package would
import itself. Renaming this directory reintroduces that bug.

--- Shape of the graph ---
    Portfolio Orchestrator (triage)
        ├── Portfolio Specialist      (6 knowledge tools)
        ├── Error Solver Specialist   (structured: ErrorSolution)
        ├── Learning Specialist       (structured: Lesson)
        └── Teaching Specialist       (structured: TeachingResult)

Specialists never hand off to each other; only the orchestrator routes.

Every entry point returns None instead of raising when the SDK or a model is
missing, so agent.py can fall back to LangGraph and then to static answers.
"""

from .context import PortfolioContext
from .orchestrator import (
    orchestrator_agent,
    reset_cache,
    run_error_solution,
    run_lesson,
    run_orchestrated_chat,
    run_teaching,
)
from .runtime import AGENTS_SDK_AVAILABLE, orchestration_status

__all__ = [
    "AGENTS_SDK_AVAILABLE",
    "PortfolioContext",
    "orchestration_status",
    "orchestrator_agent",
    "reset_cache",
    "run_error_solution",
    "run_lesson",
    "run_orchestrated_chat",
    "run_teaching",
]
