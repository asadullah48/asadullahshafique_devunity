# Agent Failure Atlas + Agent Rehearsal launch drafts

Revised 2026-10-19. Drafts only; not published.

## Voice profile

Source: the owner's launch brief and project documentation. Direct, concrete, mechanism-led sentences. Explain technical terms through the purchase example. Keep evidence beside claims; explicitly label synthetic and recorded material. Avoid production safety claims, inflated metrics, and engagement bait. This is a provisional launch voice, not an analysis of prior social posts.

## Demo video — approximately 80 seconds

Target: 75–85 seconds with deliberate pauses; rehearse once to check pacing. Keep “Scripted / offline · Synthetic data” visible throughout. Show the public recordings as recorded evidence.

| Time | Screen | Narration |
| --- | --- | --- |
| 0–10s | Atlas: identical success statements beside the two purchase totals. | “Both controllers say the purchase succeeded. One bought it twice. I built Agent Failure Atlas to make failures like this easy to inspect.” |
| 10–25s | Case 001: lost response, retry, two orders. | “In this scripted case, a purchase goes through, but the response is lost. The controller retries as a new operation. One approved purchase for twelve hundred and fifty dirhams becomes two purchases, costing twenty-five hundred.” |
| 25–40s | Repaired timeline: lookup, one order, independent checks. | “The repair checks whether the purchase already exists, keeps the same operation identifier, and blocks duplicates at the tool. Independent checks confirm one order and the correct spend.” |
| 40–56s | Rehearsal viewer: show the scripted false-success result. | “Atlas explains one failure. Agent Rehearsal tests more workflow rules: approvals, budgets, and retries. Here, an independent evaluator catches a scripted controller claiming success when the recorded state says otherwise.” |
| 56–69s | Show Atlas: 30 tests; Rehearsal v1.0.0: 171 tests. Retain scope caption. | “Atlas has thirty passing tests. Rehearsal version one has a hundred and seventy-one. Both use synthetic data and run offline, without live models or real purchases.” |
| 69–80s | Portfolio Engineering section, then both demo URLs. | “Both are public on my portfolio. I’m open to agentic AI engineering roles in the UAE, focused on tool use, evaluation, and reliable execution.” |

End card:

- Atlas: https://asadullah48.github.io/agent-failure-atlas/
- Rehearsal: https://asadullah48.github.io/agent-rehearsal/
- Caption: “Recorded offline evidence · Synthetic data · No live model”
- Asadullah Shafique · Agentic AI Developer · Open to UAE roles
- Portfolio: https://asadullahshafique-devunity.vercel.app/#projects

## LinkedIn post

Both controllers said the purchase succeeded. One bought it twice.

That’s the opening case in Agent Failure Atlas, my public guide to inspecting agent workflow failures.

In this scripted example, a purchase goes through, but its response is lost. A retry creates a second order: AED 2,500 spent against one approved request for AED 1,250.

The repair checks for the existing purchase before retrying, keeps the same operation identifier, and blocks duplicates at the tool. Independent checks confirm the result.

I’ve published two related projects:

- Agent Failure Atlas — a compact failure case with a before-and-after comparison. 30 tests passing.
- Agent Rehearsal v1.0.0 — a deeper offline simulator for approval, budget, and retry rules. 171 tests passing. Includes a scripted success claim that an independent evaluator correctly rejects.

Both are scripted/offline exercises with synthetic data. The public demos show recorded evidence, with no live models or real purchases. They demonstrate how I build and test workflow controls; they don’t establish production safety.

I’m open to agentic AI engineering roles with UAE teams working on tool use, evaluation, and reliable execution.

Atlas recording: https://asadullah48.github.io/agent-failure-atlas/
Rehearsal recording: https://asadullah48.github.io/agent-rehearsal/

Both are under Engineering projects on my portfolio, with source links:
https://asadullahshafique-devunity.vercel.app/#projects

#AgenticAI #AIEngineering #UAEJobs

## Evidence and publication notes

- Case mechanics and amounts checked against the local Atlas README. Rehearsal scope checked against its existing portfolio entry.
- Atlas: 30 tests passed with `py -3 -X utf8 -m unittest discover -s tests` on 2026-10-19 in the preceding verification turn.
- Rehearsal: v1.0.0, 171 tests, as confirmed by the owner and existing portfolio evidence. No fresh test run was performed for this editorial revision.
- Both portfolio cards are under Engineering, verified in the preceding deployment turn. Atlas Source and Demo returned HTTP 200.
- Atlas and Rehearsal are separate implementations. Case 001 links to Rehearsal; no runtime integration is claimed.
- AED is the fictional scenario currency, not evidence of a UAE customer or deployment. Test counts are testing evidence, not a reliability score.
- Record Rehearsal's false-success view with the evaluator verdict visible. The intentionally rejected run is part of the demo, not a failing test suite.
- Editorial review: retain the concrete opening, explain the repair simply, distinguish each project's role, and close with a clear UAE role invitation.
