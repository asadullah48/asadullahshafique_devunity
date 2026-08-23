"""
LLM-as-a-judge scoring.

The deterministic checks in run.py answer "did it route correctly and call the
right tool". They cannot answer "is this answer actually faithful to the source
of truth, and did it decline to invent things". That is what the judge is for.

Two rules make a judge worth trusting, and both are enforced here:

1. **Give the judge the ground truth.** A judge asked "is this accurate?" with no
   reference is just a second opinion with the same blind spots. Every rubric
   below is scored against the real portfolio.json content.

2. **Make it justify the score.** The judge returns a reason before a number, so
   a disagreement can be read and argued with instead of taken on faith.

The judge deliberately uses the same model stack as the agents (via
orchestration.runtime). Using an unrelated provider would be more rigorous, but
it would also mean this harness cannot run wherever the agents run. If you have
budget for a second provider, set JUDGE_MODEL to it — that is strictly better.
"""

from __future__ import annotations

import json
import os
from typing import Any

from pydantic import BaseModel, Field

# ─── Rubrics ─────────────────────────────────────────────────────────────────
# Each rubric states what a 5 means and what a 1 means. Vague rubrics ("is it
# good?") produce judges that cluster everything at 4 and detect nothing.
RUBRICS: dict[str, str] = {
    "faithfulness": (
        "Score how faithful the answer is to the REFERENCE FACTS.\n"
        "5 = every claim is supported by the reference facts, and specific details "
        "(names, numbers, contact details) match exactly.\n"
        "3 = broadly correct but vague where the reference facts are specific; it "
        "gestures at information it could have stated precisely.\n"
        "1 = contains a claim absent from or contradicting the reference facts."
    ),
    "hackathon_precision": (
        "The reference facts list six hackathons with a per-event result.\n"
        "5 = results are given per event, matching the reference exactly.\n"
        "3 = results are present but partially aggregated or reordered.\n"
        "1 = results are summarised as a medal count (for example 'several medals', "
        "'6 awards') instead of stated per event, or any result is wrong."
    ),
    "refusal_to_invent": (
        "The user asked for information that is NOT in the reference facts.\n"
        "5 = clearly states the information is unavailable and points to the contact "
        "options, inventing nothing.\n"
        "3 = deflects without inventing, but does not say plainly that it lacks the "
        "information.\n"
        "1 = invents any specific detail — a figure, an employer, a client name."
    ),
}

PASS_THRESHOLD = 4  # score >= 4 passes; tune with evidence, not vibes


class Verdict(BaseModel):
    """A judge's decision. Reason first, so the score has to be justified."""

    reason: str = Field(description="One or two sentences of specific justification")
    score: int = Field(ge=1, le=5, description="1-5 against the rubric")


def _reference_facts() -> str:
    """The ground truth handed to the judge: the canonical portfolio data."""
    from knowledge import PORTFOLIO

    return json.dumps(PORTFOLIO, indent=2, ensure_ascii=False)


def judge_available() -> bool:
    """True when a model can be resolved for judging."""
    from orchestration.runtime import resolve_model

    model, _ = resolve_model()
    return model is not None


async def score(rubric: str, question: str, answer: str) -> Verdict | None:
    """
    Score one answer. Returns None when no model is reachable, so the caller can
    report SKIPPED rather than invent a passing grade.
    """
    if rubric == "none":
        return None

    criteria = RUBRICS.get(rubric)
    if criteria is None:
        raise KeyError(f"Unknown rubric '{rubric}'. Known: {sorted(RUBRICS)}")

    try:
        from agents import Agent, Runner

        from orchestration.runtime import resolve_model
    except ImportError:
        return None

    override = os.getenv("JUDGE_MODEL", "").strip()
    if override:
        if "/" in override:
            from agents.extensions.models.litellm_model import LitellmModel

            model: Any = LitellmModel(model=override)
        else:
            model = override
    else:
        model, _ = resolve_model()
    if model is None:
        return None

    judge = Agent(
        name="Eval Judge",
        instructions=(
            "You grade an AI assistant's answer against a rubric and a set of reference "
            "facts. Be strict and specific: cite what is missing or wrong. Judge only "
            "against the reference facts — do not use outside knowledge, and do not "
            "reward fluency. Give the reason before the score."
        ),
        output_type=Verdict,
        model=model,
    )

    prompt = (
        f"REFERENCE FACTS (the only source of truth):\n{_reference_facts()}\n\n"
        f"RUBRIC:\n{criteria}\n\n"
        f"USER QUESTION:\n{question}\n\n"
        f"ASSISTANT ANSWER:\n{answer}\n\n"
        "Grade the assistant answer."
    )

    try:
        result = await Runner.run(judge, prompt)
        return result.final_output if isinstance(result.final_output, Verdict) else None
    except Exception:  # noqa: BLE001 - a judge failure is a skip, not a crash
        return None
