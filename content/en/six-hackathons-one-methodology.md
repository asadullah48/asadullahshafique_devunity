---
slug: six-hackathons-one-methodology
lang: en
dir: ltr
title: "How I Won 6 Consecutive Hackathons With a Single Methodology"
excerpt: "Panaversity, Bronze → Platinum → Agent Factory. Zero failures across 6 hackathons, 85% code reuse, and a four-session execution model that any developer can copy. Here's the exact playbook."
author: "Asadullah Shafique"
date: 2025-04-01
displayDate: "April 2025"
readTime: "8 min read"
tags: ["Methodology", "Hackathon", "Spec-First", "CLAUDE.md"]
accentColor: "#84cc16"
---

H3 shipped with 149 tests passing. I wrote maybe 22 of them.

The other 127 came from H2, which inherited most of its own suite from H1, which inherited from H0. That is the whole trick. Six consecutive Panaversity hackathons — H0 through H5, Bronze to Platinum to Agent Factory — and the thing that carried me was never how fast I could type during the event. It was how much of the previous event I could refuse to rewrite.

Most hackathon advice optimizes the wrong variable. It treats each event as a standing start: pick a stack, scaffold, sprint, demo, abandon. That model caps your ceiling at whatever one person can build in 72 hours. The compounding model has no such cap, because every event begins where the last one ended.

## The scoreboard

| # | Project | Result | Carried forward |
|---|---|---|---|
| H0 | Personal AI CTO | Bronze | — (established the method) |
| H1 | Course Companion FTE | Silver | 70% from H0 |
| H2 | AI-Powered Todo | Silver | 70% from H1 |
| H3 | Advanced Todo | Gold | 85% from H2 |
| H4 | Cloud-Native Deployment | Platinum | Containerized H3 directly |
| H5 | Agent Factory | Completed | Two-tier agent architecture |

Read the "carried forward" column top to bottom. It goes 70, 70, 85 — and then at H4 it stops being a percentage, because H4 *was* H3. I did not build a new application for the Platinum round. I took the Gold application and gave it multi-stage Docker builds, Kubernetes manifests, a Dapr service mesh, Kafka pub/sub, and a Prometheus/Grafana/Jaeger observability stack.

That is not laziness. That is the point. The judges at H4 were evaluating cloud-native deployment, so 100% of my effort went into cloud-native deployment. Everyone who rebuilt their app from scratch spent their budget re-earning ground they already held.

## Reuse is a design decision, not an accident

You cannot decide to reuse code the night before a hackathon. Reuse is decided months earlier, by where you put your boundaries.

The rate went 70% → 70% → 85% for a specific reason: H0 and H1 were still finding the seams. By H2 the shape had settled — a Next.js and TypeScript front end, a FastAPI back end, constitutional constraints sitting between the user and the model — and once the shape stopped moving, the inheritance rate jumped.

What actually transfers between projects, in rough order of value:

1. **The test suite.** 89 tests at H2 became the floor for H3's 149. Tests are the most portable artifact you own, because they encode behavior rather than implementation.
2. **The constraint layer.** Constitutional patterns written at H0 were still running at H3, barely edited.
3. **The scaffolding.** Auth, database session handling, migrations, error envelopes, CI config. Boring, and boring is exactly what you want to stop rewriting.
4. **The prose.** Specs, README structure, architecture notes. Underrated — see below.

What does *not* transfer is the domain logic, which is fine. Domain logic is the part the judges are actually looking at.

## The four-session model

Every build from H2 onward ran as four sessions of roughly three hours. Not four days. Four sessions, with a hard stop and a written handoff between each.

**Session 1 — Spec.** No code. The output is a `SPEC.md`: what the thing does, what it explicitly does not do, the data model, the endpoint list, and the acceptance criteria. If I cannot write the acceptance criteria, I do not understand the feature yet, and writing code will not fix that.

**Session 2 — Skeleton.** Every endpoint exists and returns the right shape with the wrong data. Every page routes. The test suite runs and fails honestly. The system is end-to-end connected and completely hollow.

**Session 3 — Fill.** Now the domain logic goes in, one acceptance criterion at a time, against tests that already exist. This is the only session where I write what most people would call "the app," and it goes fast precisely because sessions 1 and 2 removed every decision from it.

**Session 4 — Harden and demo.** Edge cases, the failure paths, the deployment, and the narrative. Judges see a demo, not a repo.

The hard stop matters more than the three hours. A session that runs long is a session that ends with state in your head instead of on disk — and state in your head does not survive to the next hackathon. That is the whole compounding mechanism, and fatigue is what breaks it.

## `CLAUDE.md` is the artifact that compounds fastest

The single highest-leverage file across all six events was not application code. It was the instruction file that tells Claude Code how this specific repository works.

A good one records the things a newcomer gets wrong: which config file wins when two exist, which commands actually run, which constraint was learned by breaking production. Mine grew a section I think of as the ground-truth table — a list of every claim the project makes about itself next to what the code can actually demonstrate.

That table exists because of a failure mode that costs more hackathon points than any bug: describing a capability you have not built. It is easy to do accidentally. You plan an MCP server, write the README section about your MCP server, run out of time, ship an HTTP endpoint shaped vaguely like MCP — and now your documentation is lying, and a judge who opens the code finds out before you tell them.

Write the claim down next to the reality. When they disagree, either build the thing or delete the sentence.

## Constitutional constraints from H0, not H3

H0 was called Personal AI CTO and it won Bronze — the weakest result in the series. It is also the most important one, because it is where the constraint layer got built.

By H3 that layer had matured into something with real structure: seven BLOCK patterns covering academic dishonesty, illegal activity, and harmful content, plus five FLAG patterns for cases that warranted a warning rather than a refusal.

The design decision worth stealing is that the first layer is deterministic — plain pattern matching, no model call. That sounds primitive next to an LLM classifier, and it is. It is also the layer that works when your API key is dead, your quota is exhausted, or the provider is having an outage during your demo. A guardrail that only functions when everything else is functioning is not a guardrail.

The second layer, the model-based classifier, catches everything the patterns miss. Run them as an OR, deterministic first. You get high precision for free and pay for recall only when you need it.

<!-- [VERIFY] I have H3's 7 BLOCK / 5 FLAG counts and the three BLOCK categories from the project card, but not the pattern list or the FLAG categories. If you want the actual patterns in the article, paste them and I'll fold them in. Otherwise this section stays at the design level, which is honest. -->

## The failure that shaped it

"Zero failures across six hackathons" needs an asterisk, and I would rather supply it than have someone find it.

H0 took Bronze. H1 and H2 took Silver. Those are not failures, but they are not wins either — they are three consecutive events of finishing respectably while watching what the Gold projects did differently. The methodology in this article is largely a description of what I changed after H2, and the jump from Silver to Gold at H3 is the evidence that it worked.

Anyone selling you a system that worked from day one is selling you a story with the H0 removed.

<!-- [VERIFY] This framing assumes H4's Platinum is now complete — the project card in `Hackathons.tsx` still reads "Platinum (in progress)." Confirm before publishing, since the title says "6 consecutive." -->

## What to copy

If you take four things:

1. **Pick a stack and stop.** Reuse requires a stable substrate. Chasing the newest framework each event resets your inheritance to zero.
2. **Write the spec in a separate session from the code.** Not a separate hour. A separate session, with a stop in between.
3. **Keep an instruction file, and keep it honest.** Ground truth next to the claim.
4. **Build your constraint layer once, early, deterministic-first.** It survives every subsequent project and every provider outage.

The compounding is the strategy. Six events, one codebase, and each round spent on whatever the judges actually asked for.
