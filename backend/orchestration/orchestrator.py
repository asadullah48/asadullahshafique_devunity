"""
The orchestrator: one triage agent that owns routing, plus the entry points the
HTTP layer calls.

CLAUDE.md Rule 1 puts routing in exactly one place. The triage agent holds a
handoff to each specialist; the specialists hold none. So the graph is a star,
every run has a single hop, and `PortfolioContext.route` tells you afterwards
which specialist answered.

Not every endpoint needs triage. /api/agent/chat does — an arbitrary visitor
question could be about projects or about a stack trace. /api/agent/solve-error,
/api/learn and /api/teach do not: the URL already identified the domain, so they
invoke their specialist directly. Routing something already routed is a wasted
model call, not extra rigour.

Every entry point returns `None` rather than raising when the SDK or a model is
unavailable. agent.py treats `None` as "fall through to the legacy path".
"""

from __future__ import annotations

import logging
from typing import Any

from pydantic import BaseModel

from . import specialists
from .context import PortfolioContext
from .runtime import AGENTS_SDK_AVAILABLE, resolve_model

if AGENTS_SDK_AVAILABLE:
    from agents import Agent, RunContextWrapper, Runner, handoff

logger = logging.getLogger(__name__)

ORCHESTRATOR_INSTRUCTIONS = (
    "You are the router for Asadullah Shafique's portfolio assistant. Decide which "
    "specialist should handle the user's message and hand off to exactly one of them.\n"
    "- Questions about Asadullah — his skills, projects, hackathons, experience, how to "
    "contact or hire him, how he builds agents — go to the Portfolio Specialist.\n"
    "- An error message, stack trace, or broken code goes to the Error Solver Specialist.\n"
    "- A request to learn or be taught a topic goes to the Learning Specialist.\n"
    "- A user contributing knowledge for others goes to the Teaching Specialist.\n"
    "Hand off; do not answer yourself. When the message is ambiguous or is small talk, "
    "prefer the Portfolio Specialist, since this assistant exists to represent Asadullah."
)

_orchestrator: Any | None = None


def _make_handoff(agent: Any) -> Any:
    """Wrap a specialist so the run records which one took over."""

    async def _on_handoff(ctx: RunContextWrapper[PortfolioContext]) -> None:
        if ctx is not None and ctx.context is not None:
            ctx.context.record_agent(agent.name)

    return handoff(agent, on_handoff=_on_handoff)


def orchestrator_agent() -> Any | None:
    """Build (once) the triage agent, or return None if unavailable."""
    global _orchestrator
    if _orchestrator is not None:
        return _orchestrator
    if not AGENTS_SDK_AVAILABLE:
        return None
    model, _ = resolve_model()
    if model is None:
        return None

    targets = [
        specialists.portfolio_agent(),
        specialists.error_solver_agent(),
        specialists.learning_agent(),
        specialists.teaching_agent(),
    ]
    if any(t is None for t in targets):
        return None

    _orchestrator = Agent(
        name="Portfolio Orchestrator",
        instructions=ORCHESTRATOR_INSTRUCTIONS,
        handoffs=[_make_handoff(t) for t in targets],
        model=model,
    )
    return _orchestrator


def reset_cache() -> None:
    """Drop the cached orchestrator and specialists. For tests and env changes."""
    global _orchestrator
    _orchestrator = None
    specialists.reset_cache()


def _as_text(output: Any) -> str:
    """
    Render a final output as prose.

    Triage may hand off to a specialist with a structured `output_type`, so a
    chat turn can come back as a model rather than a string. Flattening it here
    keeps /api/agent/chat's contract (`answer: str`) intact.
    """
    if isinstance(output, str):
        return output
    if isinstance(output, BaseModel):
        parts = []
        for name, value in output.model_dump().items():
            if value in (None, "", [], {}):
                continue
            if isinstance(value, list):
                value = "; ".join(str(v) for v in value)
            parts.append(f"{name.replace('_', ' ').capitalize()}: {value}")
        return "\n".join(parts)
    return str(output)


async def _run(agent: Any, prompt: str, ctx: PortfolioContext) -> Any | None:
    """Run one agent, converting any failure into None so callers can fall back."""
    try:
        result = await Runner.run(agent, prompt, context=ctx)
        return result.final_output
    except Exception as exc:  # noqa: BLE001 - a model failure must not 500 the site
        logger.warning("Agent run failed (%s): %s", getattr(agent, "name", "?"), exc)
        return None


# ─── Entry points ────────────────────────────────────────────────────────────


async def run_orchestrated_chat(
    question: str, session_id: str | None = None
) -> dict[str, Any] | None:
    """Triage a free-form question. Returns {'answer', 'mode', 'trace'} or None."""
    agent = orchestrator_agent()
    if agent is None:
        return None
    ctx = PortfolioContext(session_id=session_id)
    output = await _run(agent, question, ctx)
    if output is None:
        return None
    return {"answer": _as_text(output), "mode": "agents-sdk", "trace": ctx.trace()}


async def run_error_solution(
    error_message: str,
    code_snippet: str | None = None,
    language: str = "python",
    context: str | None = None,
) -> dict[str, Any] | None:
    """Debug an error. Returns an ErrorSolverResponse-shaped dict, or None."""
    agent = specialists.error_solver_agent()
    if agent is None:
        return None
    prompt = "\n".join(
        part
        for part in [
            f"Language: {language}",
            f"Error: {error_message}",
            f"Code:\n{code_snippet}" if code_snippet else "",
            f"Context: {context}" if context else "",
        ]
        if part
    )
    ctx = PortfolioContext()
    ctx.record_agent(agent.name)
    output = await _run(agent, prompt, ctx)
    return output.model_dump() if isinstance(output, BaseModel) else None


async def run_lesson(
    topic: str,
    level: str = "beginner",
    learning_style: str = "interactive",
    questions: list[str] | None = None,
) -> dict[str, Any] | None:
    """Build a lesson plan. Returns a LearnResponse-shaped dict, or None."""
    agent = specialists.learning_agent()
    if agent is None:
        return None
    prompt = "\n".join(
        part
        for part in [
            f"Topic: {topic}",
            f"Level: {level}",
            f"Learning style: {learning_style}",
            "Learner questions: " + "; ".join(questions) if questions else "",
        ]
        if part
    )
    ctx = PortfolioContext()
    ctx.record_agent(agent.name)
    output = await _run(agent, prompt, ctx)
    return output.model_dump() if isinstance(output, BaseModel) else None


async def run_teaching(
    topic: str,
    content: str,
    difficulty: str = "intermediate",
    examples: list[str] | None = None,
) -> dict[str, Any] | None:
    """Structure contributed knowledge. Returns a TeachResponse-shaped dict, or None."""
    agent = specialists.teaching_agent()
    if agent is None:
        return None
    prompt = "\n".join(
        part
        for part in [
            f"Topic: {topic}",
            f"Difficulty: {difficulty}",
            f"Contributed content:\n{content}",
            "Examples: " + "; ".join(examples) if examples else "",
        ]
        if part
    )
    ctx = PortfolioContext()
    ctx.record_agent(agent.name)
    output = await _run(agent, prompt, ctx)
    return output.model_dump() if isinstance(output, BaseModel) else None
