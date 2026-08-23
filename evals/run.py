"""
Eval runner for the portfolio agent graph.

    python evals/run.py                     # every suite
    python evals/run.py --suite routing     # one suite
    python evals/run.py --strict            # exit 1 on any failure (CI)
    python evals/run.py --report out.json   # machine-readable results

Two layers, deliberately:

  DETERMINISTIC   route / tool-use / substring checks, read from
                  PortfolioContext.trace(). Cheap, exact, no judge required.
                  This is where routing regressions get caught.

  JUDGED          an LLM scores the prose against a rubric and the real
                  portfolio.json. Catches "technically routed fine, but the
                  answer is vague or invented".

A case passes only if BOTH layers pass. A case whose deterministic checks fail
is not rescued by a good prose score — answering fluently from memory instead of
calling the tool is exactly the failure mode this harness exists to surface.

Exit codes: 0 = pass (or skipped), 1 = at least one failure under --strict.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

# The agent code lives in backend/. Put it on the path before importing it.
ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from judge import PASS_THRESHOLD, judge_available, score  # noqa: E402

CASES_DIR = Path(__file__).resolve().parent / "cases"


@dataclass
class CaseResult:
    """One case's outcome across both layers."""

    suite: str
    case_id: str
    ok: bool
    failures: list[str] = field(default_factory=list)
    route: list[str] = field(default_factory=list)
    tools: list[str] = field(default_factory=list)
    judge_score: int | None = None
    judge_reason: str | None = None
    answer: str = ""

    def as_dict(self) -> dict:
        return {
            "suite": self.suite,
            "id": self.case_id,
            "ok": self.ok,
            "failures": self.failures,
            "route": self.route,
            "tools": self.tools,
            "judge_score": self.judge_score,
            "judge_reason": self.judge_reason,
            "answer": self.answer[:500],
        }


def _check_deterministic(expect: dict, result: dict) -> list[str]:
    """Return a list of human-readable failures. Empty means pass."""
    failures: list[str] = []
    trace = result.get("trace", {})
    route = trace.get("route", [])
    tools = trace.get("tools", [])
    answer = result.get("answer", "")
    lowered = answer.lower()

    want_route = expect.get("route") or []
    if want_route and route != want_route:
        failures.append(f"route: expected {want_route}, got {route or '[]'}")

    want_tools = expect.get("tools_any") or []
    if want_tools and not any(t in tools for t in want_tools):
        failures.append(f"tools: expected one of {want_tools}, called {tools or '[]'}")

    want_any = expect.get("must_contain_any") or []
    if want_any and not any(s.lower() in lowered for s in want_any):
        failures.append(f"content: none of {want_any} present")

    for banned in expect.get("must_not_contain") or []:
        if banned.lower() in lowered:
            failures.append(f"content: contains banned text {banned!r}")

    return failures


async def _attempt(prompt: str, attempts: int, backoff: float) -> dict | None:
    """
    Run one prompt, retrying on a None result.

    An eval suite fires many requests back to back, which is exactly the shape
    that trips free-tier rate limits. Without this the harness reports its own
    throttling as agent failures — it scored a run 2/6 that was really 6/6.
    The orchestrator collapses every error to None, so a rate limit and a real
    outage look identical from here; retrying with backoff separates them in
    practice.
    """
    from orchestration import run_orchestrated_chat

    for attempt in range(attempts):
        result = await run_orchestrated_chat(prompt)
        if result is not None:
            return result
        if attempt < attempts - 1:
            await asyncio.sleep(backoff * (attempt + 1))
    return None


async def _run_case(
    suite: str,
    case: dict,
    use_judge: bool,
    attempts: int = 3,
    backoff: float = 5.0,
) -> CaseResult:
    result = await _attempt(case["input"], attempts, backoff)
    if result is None:
        return CaseResult(
            suite=suite,
            case_id=case["id"],
            ok=False,
            failures=[
                f"no result after {attempts} attempts — provider error, rate limit, "
                "or exhausted quota. NOT necessarily a routing failure."
            ],
        )

    failures = _check_deterministic(case.get("expect", {}), result)
    trace = result.get("trace", {})
    outcome = CaseResult(
        suite=suite,
        case_id=case["id"],
        ok=not failures,
        failures=failures,
        route=trace.get("route", []),
        tools=trace.get("tools", []),
        answer=result.get("answer", ""),
    )

    rubric = case.get("rubric", "none")
    if use_judge and rubric != "none":
        verdict = await score(rubric, case["input"], outcome.answer)
        if verdict is not None:
            outcome.judge_score = verdict.score
            outcome.judge_reason = verdict.reason
            if verdict.score < PASS_THRESHOLD:
                outcome.failures.append(f"judge[{rubric}]: {verdict.score}/5 — {verdict.reason}")
                outcome.ok = False

    return outcome


def _load_suites(only: str | None) -> list[dict]:
    suites = []
    for path in sorted(CASES_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if only and data.get("suite") != only:
            continue
        suites.append(data)
    return suites


async def main() -> int:
    parser = argparse.ArgumentParser(description="Run agent evals")
    parser.add_argument("--suite", help="Run only this suite")
    parser.add_argument("--strict", action="store_true", help="Exit 1 on any failure")
    parser.add_argument("--no-judge", action="store_true", help="Deterministic checks only")
    parser.add_argument("--report", help="Write a JSON report to this path")
    parser.add_argument(
        "--attempts", type=int, default=3, help="Retries per case before calling it a failure"
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=3.0,
        help="Seconds to pause between cases. Free-tier providers rate-limit by "
        "requests-per-minute; without a pause the harness measures its own throttling.",
    )
    args = parser.parse_args()

    if not judge_available():
        # Loud skip, exit 0. A CI that silently "passes" with no model is worse
        # than one that says plainly it could not measure anything.
        print("SKIPPED: no model reachable (set ANTHROPIC_API_KEY, OPENAI_API_KEY,")
        print("         GEMINI_API_KEY, or ORCHESTRATOR_MODEL). Nothing was measured.")
        return 0

    suites = _load_suites(args.suite)
    if not suites:
        print(f"No suites found{' for ' + args.suite if args.suite else ''}.")
        return 1

    results: list[CaseResult] = []
    for suite in suites:
        print(f"\n=== {suite['suite']} — {suite['description']} ===")
        for index, case in enumerate(suite["cases"]):
            if index or results:
                await asyncio.sleep(args.delay)
            outcome = await _run_case(
                suite["suite"],
                case,
                use_judge=not args.no_judge,
                attempts=args.attempts,
            )
            results.append(outcome)
            mark = "PASS" if outcome.ok else "FAIL"
            judged = f" judge={outcome.judge_score}/5" if outcome.judge_score else ""
            print(f"  [{mark}] {outcome.case_id}{judged}")
            print(f"         route={outcome.route or '[]'} tools={outcome.tools or '[]'}")
            for failure in outcome.failures:
                print(f"         ! {failure}")

    passed = sum(1 for r in results if r.ok)
    total = len(results)
    scored = [r.judge_score for r in results if r.judge_score is not None]
    print(f"\n=== SUMMARY ===\n  passed {passed}/{total}  ({passed / total:.0%})")
    if scored:
        print(f"  mean judge score {sum(scored) / len(scored):.2f}/5 over {len(scored)} judged")

    if args.report:
        Path(args.report).write_text(
            json.dumps(
                {
                    "generated_at": datetime.now(timezone.utc).isoformat(),
                    "passed": passed,
                    "total": total,
                    "results": [r.as_dict() for r in results],
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"  report written to {args.report}")

    if args.strict and passed < total:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
