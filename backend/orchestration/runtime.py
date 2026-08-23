"""
Runtime resolution for the agent graph: is the SDK here, and which model runs?

Everything in this module exists to protect one property that CLAUDE.md calls
load-bearing: **the deployed site must never 500 because a key is missing.**
Nothing here raises. Callers get `None` and fall back to the static answers.
"""

from __future__ import annotations

import logging
import os
from typing import Any

logger = logging.getLogger(__name__)

# ─── SDK availability ────────────────────────────────────────────────────────
# Import guarded the same way agent.py guards LangGraph. A deploy that somehow
# ships without the wheel degrades instead of failing at import.
try:
    from agents import Agent, Runner, set_tracing_disabled  # noqa: F401

    AGENTS_SDK_AVAILABLE = True
except ImportError:  # pragma: no cover - exercised only on a broken install
    AGENTS_SDK_AVAILABLE = False


# ─── Tracing ─────────────────────────────────────────────────────────────────
# The Agents SDK uploads traces to OpenAI's platform BY DEFAULT. For a public
# portfolio agent that means visitor questions leave our infrastructure with no
# one having asked for it. Opt in explicitly with AGENTS_TRACING=on.
TRACING_ENABLED = os.getenv("AGENTS_TRACING", "off").strip().lower() == "on"

if AGENTS_SDK_AVAILABLE and not TRACING_ENABLED:
    set_tracing_disabled(True)


# ─── Model resolution ────────────────────────────────────────────────────────
# Preference order is deliberate:
#   1. ORCHESTRATOR_MODEL — an explicit override always wins.
#   2. Claude via LiteLLM — the strongest model this project already has a key
#      for, and the same family agent.py's LangGraph path already uses.
#   3. OpenAI native — the SDK's zero-dependency default path.
#   4. Nothing — the caller degrades to static answers.
DEFAULT_CLAUDE_MODEL = "claude-sonnet-5"
DEFAULT_OPENAI_MODEL = "gpt-4o-mini"


def _claude_model() -> tuple[Any | None, str | None]:
    """Claude through LiteLLM, or (None, None) if unavailable."""
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        return None, None
    try:
        from agents.extensions.models.litellm_model import LitellmModel
    except ImportError:
        logger.info("LiteLLM extra not installed; skipping the Claude path")
        return None, None

    model_id = os.getenv("CLAUDE_MODEL", DEFAULT_CLAUDE_MODEL)
    try:
        return LitellmModel(model=f"anthropic/{model_id}", api_key=api_key), f"anthropic/{model_id}"
    except Exception as exc:  # noqa: BLE001 - model setup must never break a request
        logger.warning("Could not build the LiteLLM Claude model: %s", exc)
        return None, None


def _openai_model() -> tuple[str | None, str | None]:
    """A plain OpenAI model name, which the SDK resolves natively."""
    if not os.getenv("OPENAI_API_KEY", "").strip():
        return None, None
    model_id = os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)
    return model_id, model_id


def resolve_model() -> tuple[Any | None, str | None]:
    """
    Return `(model, label)` for building agents, or `(None, None)`.

    `model` is whatever the SDK accepts for `Agent(model=...)`: a model-name
    string on the native OpenAI path, or a Model instance for LiteLLM.
    `label` is a human-readable id for /api/agent/info — never a key.
    """
    if not AGENTS_SDK_AVAILABLE:
        return None, None

    override = os.getenv("ORCHESTRATOR_MODEL", "").strip()
    if override:
        # An override naming a provider prefix goes through LiteLLM; a bare
        # name is handed to the SDK's native resolution.
        if "/" in override:
            try:
                from agents.extensions.models.litellm_model import LitellmModel

                return LitellmModel(model=override), override
            except Exception as exc:  # noqa: BLE001
                logger.warning("ORCHESTRATOR_MODEL=%s could not be built: %s", override, exc)
                return None, None
        return override, override

    model, label = _claude_model()
    if model is not None:
        return model, label

    return _openai_model()


def orchestration_status() -> dict[str, Any]:
    """Diagnostics for /api/agent/info. Reports capability, never secrets."""
    _, label = resolve_model()
    return {
        "sdk_installed": AGENTS_SDK_AVAILABLE,
        "model": label,
        "available": AGENTS_SDK_AVAILABLE and label is not None,
        "tracing": TRACING_ENABLED,
    }
