"""
Typed shared state for the agent graph.

CLAUDE.md Rule 1 requires "shared, typed state passed between agents — never
free-form dict-passing". This is that state.

Note how the SDK treats it: the run context is passed to *your code* (tools,
hooks, callbacks) and is NEVER serialized into the prompt. So it is the right
place for request-scoped dependencies and for recording what happened, and the
wrong place for anything the model is supposed to read.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class PortfolioContext:
    """
    Request-scoped state threaded through the orchestrator and every specialist.

    `route` and `tool_calls` exist so a run can be explained after the fact:
    which specialist actually answered, and which tools it consulted. Phase 4's
    eval harness reads these to score routing decisions, not just final text.
    """

    session_id: str | None = None
    locale: str = "en"

    # Audit trail. Appended to by handoff callbacks and tool wrappers.
    route: list[str] = field(default_factory=list)
    tool_calls: list[str] = field(default_factory=list)

    def record_agent(self, name: str) -> None:
        """Note that `name` took over the run."""
        self.route.append(name)

    def record_tool(self, name: str) -> None:
        """Note that `name` was invoked."""
        self.tool_calls.append(name)

    def trace(self) -> dict[str, list[str]]:
        """A compact, JSON-safe summary of what handled this request."""
        return {"route": list(self.route), "tools": list(self.tool_calls)}
