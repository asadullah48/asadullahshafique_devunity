"""
Specialist agents. Each owns exactly one domain.

CLAUDE.md Rule 1: "Specialist agents own one domain each and never call each
other directly." Routing between them is the orchestrator's job — none of these
agents holds a handoff to a sibling. That keeps the graph a star rather than a
mesh, and it is what makes a run's `route` meaningful.

Structured outputs are not decoration. Three of these agents back HTTP endpoints
whose response models are already fixed in main.py (ErrorSolverResponse,
LearnResponse, TeachResponse). Declaring `output_type` makes the SDK enforce
that shape, so a malformed generation fails here instead of surfacing as a 500
from FastAPI's response validation.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from constitution import constitutional_output_guardrail
from knowledge import MCP_TOOL_RESULTS, PORTFOLIO_DATA

from .context import PortfolioContext
from .runtime import AGENTS_SDK_AVAILABLE, resolve_model

if AGENTS_SDK_AVAILABLE:
    from agents import Agent, RunContextWrapper, function_tool


# ─── Structured outputs (must match main.py's response models) ───────────────
class ErrorSolution(BaseModel):
    """Mirrors main.py:605 ErrorSolverResponse."""

    explanation: str = Field(description="What went wrong, in plain language")
    solution: str = Field(description="Step-by-step fix")
    corrected_code: str | None = Field(default=None, description="Corrected snippet, if applicable")
    confidence: float = Field(ge=0.0, le=1.0, description="0-1 confidence in this solution")


class Lesson(BaseModel):
    """Mirrors main.py:629 LearnResponse."""

    lesson_plan: str
    resources: list[str]
    quiz_questions: list[str]
    next_steps: str


class TeachingResult(BaseModel):
    """Mirrors main.py:653 TeachResponse."""

    acknowledgment: str
    structured_content: str
    suggested_exercises: list[str]
    related_topics: list[str]


# ─── Portfolio tools ─────────────────────────────────────────────────────────
# These mirror the MCP tools exactly, and for the same reason: one source of
# truth. If you add a tool here, add it to mcp_server.py too, or an MCP client
# and the site's own agent will start disagreeing.

if AGENTS_SDK_AVAILABLE:

    def _record(ctx: RunContextWrapper[PortfolioContext], tool: str) -> None:
        """Log the call on the shared context, tolerating a missing context."""
        if ctx is not None and ctx.context is not None:
            ctx.context.record_tool(tool)

    @function_tool
    def get_skills(ctx: RunContextWrapper[PortfolioContext]) -> dict[str, Any]:
        """Asadullah's technical skills: languages, frameworks, data, AI tooling, DevOps."""
        _record(ctx, "get_skills")
        return MCP_TOOL_RESULTS["get_skills"]

    @function_tool
    def get_projects(ctx: RunContextWrapper[PortfolioContext]) -> list[dict[str, Any]]:
        """Asadullah's projects with status, summary, tech stack, and published metrics."""
        _record(ctx, "get_projects")
        return MCP_TOOL_RESULTS["get_projects"]

    @function_tool
    def get_contact(ctx: RunContextWrapper[PortfolioContext]) -> dict[str, Any]:
        """How to reach Asadullah: email, WhatsApp, GitHub, Discord, portfolio URL."""
        _record(ctx, "get_contact")
        return MCP_TOOL_RESULTS["get_contact"]

    @function_tool
    def get_about(ctx: RunContextWrapper[PortfolioContext]) -> dict[str, Any]:
        """Background: roles, location, positioning, focus, education."""
        _record(ctx, "get_about")
        return MCP_TOOL_RESULTS["get_about"]

    @function_tool
    def get_hackathons(ctx: RunContextWrapper[PortfolioContext]) -> dict[str, Any]:
        """Hackathon record: six Panaversity hackathons with per-event results."""
        _record(ctx, "get_hackathons")
        return MCP_TOOL_RESULTS["get_hackathons"]

    @function_tool
    def get_agent_engineering(ctx: RunContextWrapper[PortfolioContext]) -> dict[str, Any]:
        """The agent engineering framework: harness, loop, and graph disciplines."""
        _record(ctx, "get_agent_engineering")
        return MCP_TOOL_RESULTS["get_agent_engineering"]

    PORTFOLIO_TOOLS = [
        get_skills,
        get_projects,
        get_contact,
        get_about,
        get_hackathons,
        get_agent_engineering,
    ]
else:  # pragma: no cover - only when the SDK is absent
    PORTFOLIO_TOOLS = []


# ─── Instructions ────────────────────────────────────────────────────────────
# The anti-fabrication clause is repeated per agent on purpose. This agent
# speaks for a real person to prospective employers; an invented client or
# metric is worse than "I don't know", and CLAUDE.md's Reality Rule applies to
# generated text as much as to code.
_NO_INVENTION = (
    "Never invent awards, metrics, clients, employers, or dates. If a detail is not "
    "available from your tools, say you do not have it and point to the contact options."
)

PORTFOLIO_INSTRUCTIONS = (
    f"You answer questions about {PORTFOLIO_DATA['name']}, an agentic AI developer.\n\n"
    "TOOL USE IS MANDATORY, NOT OPTIONAL. Before answering a question about any "
    "topic below, call its tool first. Answering from memory is a failure even "
    "when the answer sounds right.\n"
    "  contact, email, hire, reach, get in touch  -> get_contact\n"
    "  projects, what he built, case studies      -> get_projects\n"
    "  skills, stack, languages, frameworks       -> get_skills\n"
    "  hackathons, awards, competitions           -> get_hackathons\n"
    "  background, who he is, roles, education    -> get_about\n"
    "  how he builds agents, harness/loop/graph   -> get_agent_engineering\n\n"
    "Answer with the SPECIFIC values the tool returned. If asked how to reach him, "
    "give the actual email, WhatsApp number and Discord link — never redirect to "
    "'the contact form' or 'his website' while holding the real details.\n\n"
    f"{_NO_INVENTION} "
    "State hackathon results exactly as the tool returns them; never summarise them "
    "as a medal count. Be concise: under four sentences unless asked for detail."
)
# The earlier version said only "use your tools ... do not answer from memory",
# and the model ignored it: asked how to contact Asadullah it replied "use the
# contact form" with an empty tool_calls trace, while holding an email, a phone
# number and a Discord invite. evals/cases/portfolio.json::portfolio-contact
# pins that regression. Naming each trigger and forbidding the specific evasion
# is the fix — re-run the suite before believing it worked.

ERROR_SOLVER_INSTRUCTIONS = (
    "You are a debugging specialist. Given an error message and optional code, explain "
    "the root cause in plain language, give a step-by-step fix, and supply corrected code "
    "when a snippet was provided. Set `confidence` honestly: below 0.5 when the snippet is "
    "missing or the error is ambiguous. Do not guess at code you were not shown."
)

LEARN_INSTRUCTIONS = (
    "You are a learning designer. Build a lesson plan matched to the requested level and "
    "learning style. Resources must be real, well-known, and named precisely — if you are "
    "unsure a resource exists, leave it out rather than inventing a title or URL. Quiz "
    "questions must be answerable from the lesson plan you just wrote."
)

TEACH_INSTRUCTIONS = (
    "You organise contributed knowledge. Acknowledge the contribution, restructure the "
    "content into a clear teachable form, propose practical exercises, and list genuinely "
    "related topics. Never contradict or silently 'correct' the contributor's material — "
    "if something looks wrong, note it in the acknowledgment instead."
)


# ─── Agent construction ──────────────────────────────────────────────────────
# Agents are built lazily and cached. Building at import time would resolve the
# model before the environment is necessarily loaded, and would make importing
# this module fail on a machine with no keys.
_cache: dict[str, Any] = {}


def _build(key: str, **kwargs: Any) -> Any | None:
    """Construct and cache one agent, or return None if no model is available."""
    if key in _cache:
        return _cache[key]
    if not AGENTS_SDK_AVAILABLE:
        return None
    model, _ = resolve_model()
    if model is None:
        return None
    agent = Agent(model=model, **kwargs)
    _cache[key] = agent
    return agent


def portfolio_agent() -> Any | None:
    """
    Specialist for questions about Asadullah himself.

    This is the only specialist carrying an output guardrail. It is the one that
    emits free prose about a real person to prospective employers, so it is the
    one where a fabricated employer, client or credential would do actual
    damage. The other three return structured objects whose shape is already
    constrained by their output_type.
    """
    return _build(
        "portfolio",
        name="Portfolio Specialist",
        handoff_description=(
            "Questions about Asadullah: skills, projects, hackathons, contact, agent engineering."
        ),
        instructions=PORTFOLIO_INSTRUCTIONS,
        tools=PORTFOLIO_TOOLS,
        output_guardrails=[constitutional_output_guardrail],
    )


def error_solver_agent() -> Any | None:
    """Specialist for debugging errors and stack traces."""
    return _build(
        "error_solver",
        name="Error Solver Specialist",
        handoff_description="Debugging: a stack trace, exception, or misbehaving code snippet.",
        instructions=ERROR_SOLVER_INSTRUCTIONS,
        output_type=ErrorSolution,
    )


def learning_agent() -> Any | None:
    """Specialist for producing lesson plans."""
    return _build(
        "learning",
        name="Learning Specialist",
        handoff_description="Requests to learn a topic, or for a lesson plan.",
        instructions=LEARN_INSTRUCTIONS,
        output_type=Lesson,
    )


def teaching_agent() -> Any | None:
    """Specialist for structuring contributed knowledge."""
    return _build(
        "teaching",
        name="Teaching Specialist",
        handoff_description="A user contributing knowledge to be structured for teaching.",
        instructions=TEACH_INSTRUCTIONS,
        output_type=TeachingResult,
    )


def reset_cache() -> None:
    """Drop cached agents. Used by tests and after an environment change."""
    _cache.clear()
