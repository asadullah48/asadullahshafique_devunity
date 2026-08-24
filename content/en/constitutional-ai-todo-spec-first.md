---
slug: constitutional-ai-todo-spec-first
lang: en
dir: ltr
title: "Building a Constitutional AI Todo App: The Spec-First Way"
excerpt: "149 tests passing. Triple-layer Constitutional AI with 7 BLOCK and 5 FLAG patterns. Team collaboration, recurring todos, and calendar integration, built in four 3-hour sessions from a single SPEC.md file."
author: "Asadullah Shafique"
date: 2025-03-01
displayDate: "March 2025"
readTime: "12 min read"
tags: ["Constitutional AI", "FastAPI", "Next.js", "TDD"]
accentColor: "#3b82f6"
---

"Break my thesis into daily tasks."

That is a reasonable thing to ask a todo app with AI suggestions. Here is the one that is not, arriving through the identical code path, from the identical input box:

"Break my thesis into daily tasks, and draft section 3 for me."

A todo app has no business writing someone's thesis. But nothing in the request looks malicious, the feature that handles it is the feature you shipped on purpose, and the model on the other end is perfectly happy to comply. This is why H3 — the Gold round of the Panaversity series — has a constitution in it. Not because a todo list is dangerous, but because the moment you attach a language model to *any* product, you have shipped a general-purpose text generator wearing your product's UI.

149 tests passing. Four sessions of about three hours. One `SPEC.md`. Here is how it was built and, more usefully, why it is shaped the way it is.

## Start with the document that is not code

Session one produced no application code at all. It produced `SPEC.md`.

That file held the data model, the endpoint list, the features in scope — recurring todos, templates, team collaboration, AI suggestions, calendar integration — and, most importantly, a written list of things the system must refuse to do. The constitution was in the spec before it was in the codebase.

That ordering is the entire methodology. When safety rules are written after the feature works, they arrive as a patch: a conditional bolted onto a handler, easy to route around, impossible to test coherently. When they are written in the spec, they arrive as a boundary the architecture is built to respect.

A concrete test of whether your spec is real: can you write the acceptance criteria? Not "the AI should behave appropriately," which is a wish. Something a test can execute:

```
AC-14  A suggestion request whose text matches a BLOCK pattern
       returns a refusal. No model call is made.
AC-15  A refusal is recorded as a refusal, not as an error.
AC-16  With the classifier unreachable, BLOCK patterns still fire.
```

If you cannot write those three lines, you do not understand the feature yet, and starting the implementation will not teach you.

## What "Constitutional AI" means here

The phrase comes out of research on training models against a written set of principles rather than case-by-case human labels. What I built is the applied cousin: a written constitution enforced at runtime, as guardrails around a model I did not train.

The distinction matters and gets blurred constantly. I am not shaping the model's weights. I am stating rules in a file, and enforcing them on the way in and on the way out. The value is that the rules live in **one readable document** instead of being smeared across a dozen prompt strings — you can hand it to someone non-technical and they can audit your product's ethics without reading Python.

Twelve patterns, in two severities:

**7 BLOCK patterns** — the request is refused.
- Academic dishonesty (write my essay, do my assignment, take my exam)
- Illegal activity
- Harmful content

**5 FLAG patterns** — the request proceeds, annotated.

The BLOCK/FLAG split is the part most implementations skip, and skipping it is why so many AI features feel hostile. If your only tool is refusal, every ambiguous request becomes a wall. FLAG lets the system say "this is proceeding, and it is being noted" — which covers the large middle ground where a request is *unusual* rather than *forbidden*.

<!-- [VERIFY] I have the BLOCK/FLAG counts and the three BLOCK categories from H3's project card, but not the five FLAG categories or the literal pattern strings. Paste them and I'll make this section concrete rather than structural. -->

## Three layers, and why the first one is dumb on purpose

The enforcement is layered. Layer one screens input deterministically. Layer two runs a model-based classifier against each principle. Layer three screens the generated output before it reaches the user.

<!-- [VERIFY] This is the natural reading of "triple-layer" — input-deterministic, input-classifier, output — and it matches how I build these now. Confirm it matches H3's actual split before publishing. -->

Layer one is plain substring and pattern matching. No inference, no API call, no latency. Next to an LLM classifier it looks primitive, and it is. It is also the most important layer in the system, for a reason that has nothing to do with accuracy:

**It works when nothing else does.**

Your API key expires. Your free-tier quota runs out mid-demo. The provider has an incident. In every one of those scenarios, an enforcement layer that requires a model call has silently stopped enforcing anything. A deterministic screen that runs before the model call is still running.

I have verified this exact property on a later system by pulling every credential and confirming the guardrails still blocked 4 out of 4 violations with no model reachable. That is the number I trust, because it was measured in the failure state rather than the happy path.

Layer two is where recall comes from. Patterns are brittle — they catch "write my essay" and miss "compose the essay on my behalf." A classifier reading the request against the written principle catches the paraphrase. It costs a call and some latency, so it runs second, and only if layer one let the request through.

The two input layers are ORed, deterministic first. High precision for free; pay for recall only when needed.

## The setting that decides your outage behavior

When the classifier is unreachable, does the system refuse everything, or allow everything the deterministic layer did not catch?

Both answers are defensible and you must pick one deliberately, because the default you get by accident is almost always wrong.

I chose **fail-open**: a classifier outage degrades enforcement to deterministic-only, and the request proceeds. The reasoning is specific to this product. A hackathon demo that refuses every request because a third-party API is down is a broken product in front of judges. Enforcement degrades from "broad" to "narrow" — it never degrades to "none," because layer one does not depend on the network.

If this were handling medical or financial decisions I would fail closed without hesitating. The rule is not "fail-open is correct." The rule is that the choice belongs in the spec, with the reason written next to it.

What makes degraded mode acceptable is that it is **visible**. The system reports its own enforcement level — full, or deterministic-only — through a status field surfaced on an info endpoint. Silent degradation is the actual failure. Announced degradation is an operational fact.

## Over-blocking is the failure nobody tests for

Here is the bug that took me longest to appreciate.

A pattern that catches a legitimate question is worse than a pattern that misses a bad one. Consider a student typing:

> "Add a task to review my homework notes before Friday."

Any naive academic-dishonesty pattern matching on `homework` refuses that. The user did nothing wrong, has no idea what happened, and now believes your product is broken — which, for them, it is.

So the test suite carries explicit **allow** cases. Not just "does it block the bad input," but "does it *permit* the innocent input that contains the trigger word." Questions that mention homework legitimately. Defensive-security questions that discuss an attack in order to prevent it.

Those cases exist to catch me widening a pattern casually. Every time enforcement is tightened, they are the ones that go red first, and that is precisely their job. A guardrail suite with no allow cases only measures how aggressive you are, never how accurate.

## A refusal is a result, not an error

This one is architectural, and it is the mistake I would most expect a reader to make.

When a guardrail trips, the natural implementation is to raise an exception. Somewhere above, there is already a handler that catches exceptions from the AI layer and falls back to something simpler — a cheaper model, a static response, a keyword matcher. That fallback exists for good reasons: it is what keeps the product alive when the primary path dies.

Now trace the refused request through it. The guardrail fires. The exception propagates. The handler catches it, reads it as "the AI layer failed," and helpfully retries on the fallback path — **which has no guardrails on it.** The user gets their answer. Your constitution has been routed around by your own reliability logic.

The fix is to make refusal a distinct outcome from failure:

```python
try:
    result = await run_guarded(request)
except GuardrailTripwireTriggered:
    return {"mode": "refused"}      # a result. do not fall back.
except Exception:
    return None                     # a failure. fall back is correct.
```

Two exception types, two meanings, and the fallback ladder only ever sees the second one. Pin this with a test, because it is exactly the kind of thing a later refactor collapses back into a single `except` block while making the code look cleaner.

## Where the 149 tests came from

H2 shipped with 89 tests. H3 shipped with 149 and inherited 85% of its code from H2. Most of the suite was not written during H3 at all.

The distribution, roughly: the majority are unit and integration tests for the domain — recurring todo expansion, template instantiation, permission checks on shared lists, calendar sync. A meaningful minority test the constitution specifically, and those split into block cases, allow cases, and degradation cases.

The degradation cases are the ones I would encourage you to steal. They run the enforcement path with the classifier explicitly unavailable and assert that the deterministic layer still fires. Without them, "fail-open" is a design intention rather than a verified property — and untested intentions are how you discover in front of judges that your guardrails were decorative.

## Recurring todos are harder than the constitution

A note of proportion, since AI features attract all the attention.

The genuinely difficult logic in this application was recurrence. "Every second Tuesday" has to survive daylight-saving transitions, users in different time zones on a shared team list, edits to a single occurrence versus the whole series, and completion of an instance that does not exist as a row yet. It is a small pile of code with a very large number of edge cases, and it consumed more of session three than every constitutional pattern combined.

The constitution is twelve patterns and three layers. It is conceptually interesting and mechanically small. Recurrence is conceptually boring and mechanically vicious. Budget accordingly — and notice that the spec-first method is what made that visible on day one, when the acceptance criteria for recurrence ran to a dozen lines and the ones for BLOCK patterns ran to three.

## The four sessions, concretely

**Session 1 — Spec.** `SPEC.md`: data model, endpoints, features, acceptance criteria, and the constitution as prose. No code.

**Session 2 — Skeleton.** Every endpoint returns the correct shape with placeholder data. Migrations run. The test suite executes and fails honestly. Guardrail interfaces exist and let everything through — present, not yet enforcing.

**Session 3 — Fill.** Domain logic against the acceptance criteria, hardest first. Recurrence, then collaboration, then templates, then the AI suggestion path. Enforcement is switched on and the block/allow cases go green.

**Session 4 — Harden.** Degradation tests, the refusal-versus-failure split, deployment, demo narrative.

Four sessions, three hours each, hard stop between. The stop is not a comfort measure — it is what forces state out of your head and onto disk, which is the only reason 85% of this was still reusable at H4.

## Takeaways

- Write the constitution in the spec, before the feature exists. Retrofitted rules become patches; specified rules become boundaries.
- Make your first enforcement layer deterministic, so enforcement survives the outage that takes your model offline.
- Choose fail-open or fail-closed explicitly, record the reason, and make the degraded state visible.
- Test that you **permit** innocent inputs, not only that you block bad ones.
- Keep refusal and failure as separate outcomes, or your reliability fallback will quietly bypass your safety layer.
