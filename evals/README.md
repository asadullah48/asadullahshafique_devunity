# Agent Evals

Measured quality for the agent graph in `backend/orchestration/`.

CLAUDE.md Rule 4: *"An agent whose quality is unmeasured is a demo."* This is how it gets measured.

```bash
python evals/run.py                    # every suite
python evals/run.py --suite routing    # one suite
python evals/run.py --no-judge         # deterministic checks only, no model spend
python evals/run.py --strict           # exit 1 on any failure — what CI runs
python evals/run.py --report out.json  # machine-readable results
```

## Two layers

A case passes only if **both** layers pass.

| Layer | What it checks | Cost |
|---|---|---|
| **Deterministic** | Did triage route to the right specialist? Did it call the right tool? Does the answer contain / avoid required strings? | Free — read from `PortfolioContext.trace()` |
| **Judged** | Is the prose faithful to `portfolio.json`? Did it decline to invent? | One model call per case |

The split matters. The deterministic layer catches the failure mode that
actually bites: **the agent answering fluently from memory instead of calling
its tool.** A judge scoring only prose will happily pass a confident, plausible,
unsourced answer. `trace()` will not.

A case whose deterministic checks fail is never rescued by a good prose score.

## Suites

| Suite | Subject | Pass criterion |
|---|---|---|
| `routing` | The orchestrator's handoff decisions | Correct specialist, prose ignored (`rubric: none`) |
| `portfolio` | The Portfolio Specialist's answers | Correct tool use **and** judge ≥ 4/5 |

## Case format

```jsonc
{
  "id": "portfolio-contact",
  "input": "How do I contact Asadullah?",
  "expect": {
    "route": ["Portfolio Specialist"],   // exact route, in order
    "tools_any": ["get_contact"],        // at least one of these was called
    "must_contain_any": ["asadullahshafique@hotmail.com"],
    "must_not_contain": []
  },
  "rubric": "faithfulness"               // or "none" to skip the judge
}
```

## Rubrics

Defined in `judge.py`. Each states explicitly what a 5 and a 1 look like —
vague rubrics ("is it good?") produce judges that score everything 4 and detect
nothing. Pass threshold is 4/5.

- `faithfulness` — every claim supported by `portfolio.json`, specifics exact
- `hackathon_precision` — per-event results, never summarised as a medal count
- `refusal_to_invent` — declines cleanly when the facts do not exist

The judge is given the **full `portfolio.json` as reference facts** and must
state a reason before a score. A judge with no ground truth is just a second
opinion with the same blind spots.

## Known failing case

`portfolio-contact` was **observed failing** in Phase 3: the Portfolio
Specialist answered *"use the contact form"* with an empty `tool_calls` trace,
while holding the real email, WhatsApp number and Discord link. It is committed
red on purpose — that is the defect this harness was built to make visible.

A fix has since landed in `orchestration/specialists.py`
(`PORTFOLIO_INSTRUCTIONS` now names each tool trigger explicitly and forbids
that specific evasion), but it is **unverified** — every model provider was
quota-exhausted when it was written. **Run the suite to find out whether it
worked.** Until then, assume red.

Fix the agent, never the case.

## Rate limits

Evals fire many requests in a burst, which is exactly what trips free-tier
per-minute quotas. The runner retries with backoff (`--attempts`) and paces
cases (`--delay`). Without pacing it reports its own throttling as agent
failures — an early run scored 2/6 that was genuinely 6/6. If you see
`no result after N attempts`, suspect quota before you suspect the agent.

## Model selection

By default the judge uses the same stack as the agents (`orchestration.runtime`,
so `ORCHESTRATOR_MODEL` applies). Set `JUDGE_MODEL` to grade with a different
provider — strictly better practice, since a model is a lenient judge of its own
family's output.

With no key reachable the runner prints `SKIPPED` and exits 0, stating plainly
that nothing was measured. It never reports a pass it did not observe.
