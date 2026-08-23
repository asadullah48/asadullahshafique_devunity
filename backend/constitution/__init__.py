"""
Constitutional AI — enforcement of principles.json.

    from constitution import (
        screen_input, screen_output,          # deterministic, no model needed
        constitutional_input_guardrail,       # SDK guardrails
        constitutional_output_guardrail,
        constitution_status,
    )

--- Two layers, and why ---

DETERMINISTIC   Substring screen from `deterministic_patterns`. No model, no
                network, no cost, no failure mode. This is what keeps the
                constitution enforced when every API key is dead — and during
                this project every provider ran dry at once, so that is not a
                theoretical concern. High precision, low recall on purpose.

CLASSIFIER      An LLM judges the text against each principle's `rule`, catching
                phrasing the substrings never will. Broad recall, needs a key,
                costs a call.

The layers are ORed: either can trip the wire. Deterministic runs first and
short-circuits, so a blatant request never reaches the model.

--- Fail-open, deliberately ---

If the classifier is unavailable the deterministic layer still runs and the
request proceeds. The alternative — refusing everything when the model is down —
would take a portfolio site offline in front of the exact audience it exists to
impress. `constitution_status()["enforcement"]` reports whether the full layer
is active, so the degradation is visible rather than silent.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

_SOURCE = Path(__file__).parent / "principles.json"

with _SOURCE.open(encoding="utf-8") as fh:
    _RAW: dict[str, Any] = json.load(fh)

CONSTITUTION: dict[str, Any] = {k: v for k, v in _RAW.items() if not k.startswith("_")}
VERSION: str = CONSTITUTION["version"]
PRINCIPLES: list[dict[str, Any]] = CONSTITUTION["principles"]

INPUT_PRINCIPLES = [p for p in PRINCIPLES if p["applies_to"] == "input"]
OUTPUT_PRINCIPLES = [p for p in PRINCIPLES if p["applies_to"] == "output"]


@dataclass
class Violation:
    """A principle that was breached, and how it was detected."""

    principle_id: str
    title: str
    refusal: str
    detected_by: str  # "deterministic" | "classifier"
    evidence: str = ""

    def as_dict(self) -> dict[str, str]:
        return {
            "principle": self.principle_id,
            "title": self.title,
            "detected_by": self.detected_by,
            "evidence": self.evidence,
        }


# ─── Layer 1: deterministic ──────────────────────────────────────────────────


def _screen(text: str, principles: list[dict[str, Any]]) -> Violation | None:
    """Substring screen. Returns the first violation, or None."""
    lowered = text.lower()
    for principle in principles:
        for pattern in principle.get("deterministic_patterns", []):
            if pattern in lowered:
                return Violation(
                    principle_id=principle["id"],
                    title=principle["title"],
                    refusal=principle["refusal"],
                    detected_by="deterministic",
                    evidence=pattern,
                )
    return None


def screen_input(text: str) -> Violation | None:
    """Check a user message against the input principles. No model required."""
    return _screen(text, INPUT_PRINCIPLES)


def screen_output(text: str) -> Violation | None:
    """Check an assistant answer against the output principles. No model required."""
    return _screen(text, OUTPUT_PRINCIPLES)


# ─── Layer 2: LLM classifier ─────────────────────────────────────────────────


def _classifier_prompt(principles: list[dict[str, Any]], subject: str, text: str) -> str:
    rules = "\n".join(f"- {p['id']}: {p['rule']}" for p in principles)
    return (
        f"You are a policy classifier. Decide whether the {subject} below violates "
        f"any principle.\n\nPRINCIPLES:\n{rules}\n\n"
        f"{subject.upper()}:\n{text}\n\n"
        "Be precise. Only report a violation the principle actually describes. "
        "Explaining, teaching, reviewing the user's own work, and discussing security "
        "concepts defensively are NOT violations. If nothing is violated, say so."
    )


async def _classify(text: str, principles: list[dict[str, Any]], subject: str) -> Violation | None:
    """Ask a model. Returns None when unavailable — never raises."""
    if not principles:
        return None
    try:
        from agents import Agent, Runner
        from pydantic import BaseModel, Field

        from orchestration.runtime import resolve_model
    except ImportError:
        return None

    model, _ = resolve_model()
    if model is None:
        return None

    class Judgement(BaseModel):
        reasoning: str = Field(description="One sentence naming what was or was not violated")
        violated: bool
        principle_id: str = Field(default="", description="The violated principle id, else empty")

    checker = Agent(
        name="Constitution Checker",
        instructions="You classify text against a written policy. Be exact and conservative.",
        output_type=Judgement,
        model=model,
    )

    try:
        result = await Runner.run(checker, _classifier_prompt(principles, subject, text))
        verdict = result.final_output
    except Exception as exc:  # noqa: BLE001 - a classifier outage must not block the site
        logger.warning("Constitution classifier unavailable: %s", exc)
        return None

    if not isinstance(verdict, Judgement) or not verdict.violated:
        return None

    match = next((p for p in principles if p["id"] == verdict.principle_id), principles[0])
    return Violation(
        principle_id=match["id"],
        title=match["title"],
        refusal=match["refusal"],
        detected_by="classifier",
        evidence=verdict.reasoning,
    )


async def check_input(text: str) -> Violation | None:
    """Full input check: deterministic first, then classifier."""
    return screen_input(text) or await _classify(text, INPUT_PRINCIPLES, "user request")


async def check_output(text: str) -> Violation | None:
    """Full output check: deterministic first, then classifier."""
    return screen_output(text) or await _classify(text, OUTPUT_PRINCIPLES, "assistant answer")


# ─── SDK guardrails ──────────────────────────────────────────────────────────
# Imported defensively so this module stays usable, and testable, without the SDK.

try:
    from agents import GuardrailFunctionOutput, input_guardrail, output_guardrail

    _SDK = True
except ImportError:  # pragma: no cover
    _SDK = False

if _SDK:

    @input_guardrail
    async def constitutional_input_guardrail(ctx, agent, user_input) -> GuardrailFunctionOutput:
        """Trip the wire when a request violates an input principle."""
        text = user_input if isinstance(user_input, str) else str(user_input)
        violation = await check_input(text)
        if violation:
            logger.info(
                "Constitution tripwire: %s (%s)", violation.principle_id, violation.detected_by
            )
        return GuardrailFunctionOutput(
            output_info=violation, tripwire_triggered=violation is not None
        )

    @output_guardrail
    async def constitutional_output_guardrail(ctx, agent, agent_output) -> GuardrailFunctionOutput:
        """Trip the wire when an answer violates an output principle."""
        text = agent_output if isinstance(agent_output, str) else str(agent_output)
        violation = await check_output(text)
        if violation:
            logger.info(
                "Constitution tripwire (output): %s (%s)",
                violation.principle_id,
                violation.detected_by,
            )
        return GuardrailFunctionOutput(
            output_info=violation, tripwire_triggered=violation is not None
        )
else:  # pragma: no cover
    constitutional_input_guardrail = None
    constitutional_output_guardrail = None


def constitution_status() -> dict[str, Any]:
    """Diagnostics for /api/agent/info. States plainly which layers are live."""
    classifier = False
    try:
        from orchestration.runtime import resolve_model

        classifier = resolve_model()[0] is not None
    except ImportError:
        pass
    return {
        "version": VERSION,
        "principles": [p["id"] for p in PRINCIPLES],
        "deterministic": True,
        "classifier": classifier,
        "enforcement": "full" if classifier else "deterministic-only",
    }


__all__ = [
    "CONSTITUTION",
    "INPUT_PRINCIPLES",
    "OUTPUT_PRINCIPLES",
    "PRINCIPLES",
    "VERSION",
    "Violation",
    "check_input",
    "check_output",
    "constitution_status",
    "constitutional_input_guardrail",
    "constitutional_output_guardrail",
    "screen_input",
    "screen_output",
]
