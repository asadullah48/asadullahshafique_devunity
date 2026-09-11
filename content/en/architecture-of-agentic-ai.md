---
slug: architecture-of-agentic-ai
lang: en
dir: ltr
title: "The Architecture of Agentic AI: Building Autonomous Systems That Think, Plan, and Act"
excerpt: "An LLM that answers is not an agent. An agent is a control system with a model inside it — and almost every property that makes it trustworthy lives outside the model."
description: "What actually makes a system agentic — goals, context, tools, guardrails, feedback loops, orchestration and evaluation — organised as harness, loop and graph, with the failure mode each layer exists to prevent."
abstract: "Agentic systems pursue objectives instead of answering prompts, which turns an AI problem into a systems-engineering one. This article walks the architecture around the model through three disciplines — the harness (what the agent can see and touch), the loop (how it learns what actually happened) and the graph (how work flows) — and shows where each one is implemented in the system behind this site."
author: "Asadullah Shafique"
date: 2026-09-11
category: architecture
featured: true
tags: ["Agentic AI", "Architecture", "Orchestration", "Guardrails", "Evaluation"]
accentColor: "#0ea5e9"
related: ["ksor-knowledge-system-of-record", "graph-engineering-with-claude", "constitutional-ai-todo-spec-first"]
evidence:
  - orchestration
  - interop
  - governance
  - evaluation
  - observability
  - degradation
---

Two agents are given the same task. Both return the same, correct answer.

The first took five steps. The second took twenty-five, called three tools it never needed, and at one point assembled a request that would have crossed a permission boundary had nothing been checking.

Grade only the answer and these are the same system. Put either one in production and you will learn that they are not.

That gap — between what an agent *says* and what it *did* — is where agentic architecture lives. Very little of it is the model's responsibility.

## An answer is not an action

For most of the history of applied machine learning, systems predicted, classified, recommended or generated. A request went in, an output came out, and the interaction ended.

An agentic system is built to pursue an objective. It interprets a goal, decides what to do next, uses tools, looks at what happened, and keeps going until the goal is met — or until a boundary says a human must decide.

That sounds like a small step. Architecturally it is a different kind of software. The engineering question moves from *"how do we make the model smarter?"* to *"how do we build a system around the model that can decide and act safely?"*

The clearest way to see the change is to compare three things that are routinely all called "AI agents":

| | Automation | Workflow | Agent |
|---|---|---|---|
| Who decides the next step | The trigger | Code written in advance | The model, at run time |
| Where the LLM sits | Nowhere, or one fixed call | Inside predefined steps | Inside the control loop |
| Handles the unanticipated | No | Only along paths someone drew | Yes, within bounds |
| Cost of a wrong decision | Low and predictable | Low and predictable | Bounded only by the harness |
| How you test it | Unit tests | Mostly unit tests | Trace-level evaluation |

Anthropic's engineering guide *Building effective agents* draws the same line: workflows are systems where "LLMs and tools are orchestrated through predefined code paths", while agents are systems where models "dynamically direct their own processes and tool usage". Its most useful advice is the least glamorous: use the simplest option that solves the problem.

> [!IMPLICATION]
> Autonomy is a cost, not a feature. Every decision you hand to the model is a decision you now have to bound, observe and evaluate. Hand over only the decisions that genuinely need judgment.

## Why a model alone is not an agent

Operationally, a language model is a function: context in, tokens out. It keeps no state between calls, cannot act on the world, and has no way to find out whether what it said was true.

Everything that makes a system agentic is built around that function:

```flow
Goal and constraints
Assemble the context this step needs
Decide the next step
Check the decision against policy
Act through a tool
Observe the result
Evaluate: done, retry, replan, or escalate?
↺ Loop until complete, out of budget, or handed to a human
```

A conventional AI application is *user → model → response*. An agent is that loop, and the model is one box in it. It is the box that makes the others worth building — but it is not the one that makes the system safe, explainable or recoverable.

I organise everything around the model into three disciplines, and apply them to every agent build:

- **Harness** — what the agent can see and touch.
- **Loop** — how the system learns what actually happened.
- **Graph** — how work flows between steps and between agents.

The rest of this article takes them in turn. First, the thing all three serve.

## Start with a mission, not a prompt

"Analyse these documents and produce a report" is a prompt. It is not yet something a system can execute safely, because it leaves the important questions unanswered.

A production agent needs its goal decomposed into parts that code can enforce:

| Element | Question it answers | Enforced by |
|---|---|---|
| Objective | What must be achieved? | The task specification |
| Constraints | What must never happen? | Guardrails and permissions |
| Resources | Which tools and data are available? | The tool registry |
| Success criteria | How do we know it is done? | The evaluator |
| Authority | Which actions need approval? | The action policy |

Written down, this is dull. Left implicit, it is where agents go wrong. A model asked to "clean up the customer list" with no stated constraint on deletion will eventually find a way to be very helpful.

## Discipline 1 — The harness: what the agent can see and touch

The harness is the environment the model operates in. Most of what makes an agent trustworthy is decided here, in code, before the model gets a vote.

### Context: what does the agent need right now?

An agent cannot decide well without the right information — instructions, history, retrieved documents, application state, earlier tool results, policies. The instinct is to give it everything.

The instinct is wrong. Irrelevant context costs tokens, adds latency, and gives the model more material to be confidently distracted by. Context engineering is the discipline of assembling, for each step, what that step needs and nothing else.

### Memory: purposeful, not merely persistent

Agents need state, and it helps to separate three kinds:

- **Working memory** — the current objective, plan, recent observations and intermediate decisions. Lives for one task.
- **Long-term memory** — preferences, earlier outcomes, learned facts. Lives across tasks.
- **External knowledge** — documents, databases, APIs. Lives outside the agent entirely.

Storing everything is not a memory strategy. It creates noise, cost, retrieval errors and privacy exposure. A memory system has to decide what to keep, how to index it, when to retrieve it, and when it expires.

There is a harder problem underneath. Memory tells an agent what it *remembers*, not what is *true* — and when two remembered facts disagree, memory has no rule for deciding which one wins. That job belongs to a different component, a system of record, and it is the subject of the [companion article on KSOR](/blog/ksor-knowledge-system-of-record).

### Tools: controlled capabilities, not raw access

Tools are where the agent touches the world: search, databases, code execution, business APIs. They are also where a wrong decision stops being text and becomes an event.

So the model should never hold a capability directly. It should *request* it, through an interface that is able to refuse:

```flow
Model proposes a tool call
Validate the arguments against the tool's schema
Check permission for this agent and this action
Execute
Return a structured result
```

That is what makes actions observable and enforceable. It is also why protocols matter. The [Model Context Protocol](https://modelcontextprotocol.io) gives tools a standard contract — discovery, capability negotiation, typed calls — instead of one bespoke integration per model and per tool.

> [!EVIDENCE]
> The portfolio agent behind this site exposes its knowledge through a real MCP server on the official SDK, served over Streamable HTTP. All six of its tools are read-only. That is a design decision, not an accident: an agent that can call a write tool will eventually call it wrong, so capability is scoped before the model is involved at all.

### Actions: appropriate autonomy, by risk

Not every action deserves the same trust. A workable policy classifies them:

| Risk | Examples | Default policy |
|---|---|---|
| Low | Reading public data, calculating, drafting | Execute automatically |
| Medium | Updating a record, triggering an internal workflow | Validate first, then log |
| High | Payments, irreversible deletion, security changes, external messages | Require human approval |

The goal is not maximum autonomy. It is *appropriate* autonomy: as much independence as the cost of a mistake allows.

### Guardrails: layered, and deterministic first

Guardrails can sit at every stage — on input, on the plan, on tool arguments, before execution, on output. The design question is less *where* than *what enforces them*.

A guardrail implemented as a model call is a second opinion. It is useful, and it can also be argued with, rate-limited, or unavailable. A guardrail implemented as code is a rule. The strongest pattern layers both: a narrow deterministic screen that runs first and needs no model, and a broader model-based classifier behind it.

> [!EVIDENCE]
> The agent on this site is governed by a written constitution of five principles, enforced as SDK guardrails. The input guardrail sits on the orchestrator — the single entry point, so no request can route around it. The output guardrail sits on the one specialist that writes free prose about a real person. The deterministic pattern layer trips before any model is called, so it keeps holding when no model provider is reachable at all.

> [!FAILURE]
> Guardrails can be bypassed by your own error handling. In this system, every orchestrator entry point returns `None` on failure, and the caller reads `None` as "drop to the next fallback rung". If a tripped guardrail were collapsed into `None` like any other failure, the refused request would simply be answered by the next rung down — which has no guardrail. So tripwires are re-raised past the fallback logic and returned as an explicit refusal, and an eval case pins that behaviour. If your recovery code cannot tell *blocked* from *broken*, your guardrails are decorative.

## Discipline 2 — The loop: how the system learns what happened

An agent that acts without observing the result is not running a feedback loop. It is running a script with extra steps.

### Observe after every consequential action

After each meaningful action the system should record what actually happened — success, partial success, failure, an unexpected output, a changed environment — as structured data, not as a line pasted back into a prompt.

### Know when to stop

A dangerous default is to let an agent run until the model *feels* finished. Production loops need explicit termination:

```flow
An action produces a result
The evaluator checks it against the success criteria
Complete — or retry, replan, or escalate
↺ Hard limits on iterations, cost and time apply regardless
```

The evaluator can be code (did the test pass?), a model, or a person. What matters is that "done" is a check, not a feeling.

### Treat failure as information

APIs time out. Data goes missing. Quotas run out. Plans turn out to rest on a wrong assumption. A production agent classifies failures and answers each class differently: a bounded retry for transient errors, an alternative tool, a revised plan, partial completion with a clear report, or escalation to a person.

> [!EVIDENCE]
> The agent on this site degrades down a three-rung ladder: the Agents SDK orchestrator, then a LangGraph graph, then static keyword answers. A dead key or an exhausted quota drops one rung instead of returning an error, so the page never hangs on a spinner because a provider is down. Each rung is worse than the one above it. None of them is a 500.

### Evaluate the trajectory, not just the destination

Back to the two agents from the opening. Both produced the same answer, so an evaluation that scores only the answer cannot tell them apart.

Agent evaluation has to measure *behaviour*: which tools were chosen, how many steps it took, whether a policy boundary was approached, whether the agent escalated when it should have, what the run cost. That requires the system to record its own trajectory — which is why observability and evaluation are one discipline, not two.

> [!EVIDENCE]
> This site's eval suites check the execution trace — which specialist handled the request, which tools it called — *before* a model judges the prose. One case was committed failing on purpose: asked for contact details, the portfolio specialist answered fluently ("use the contact form") without calling the tool that holds them. A judge reading only the text would have passed that answer. The trace did not.

### Observability: if you cannot see it, you cannot trust it

A useful trace captures decisions, context versions, tool calls and their results, latency, token usage, errors, retries, plan changes, evaluation outcomes and human interventions. Without it, debugging an agent is guesswork. With it, you can answer the question every incident review eventually asks: *why did the agent do that?*

## Discipline 3 — The graph: how work flows

### Planning: revise when reality disagrees

Complex objectives rarely have one-step solutions. "Research a market, compare competitors and recommend an opportunity" decomposes into scoping, gathering, validating sources, extracting facts, comparing and checking the result.

| Plan type | Works well when | Breaks when |
|---|---|---|
| Fixed | The task is predictable and repeated | Anything unexpected happens |
| Dynamic | Every task differs | Plans are never checked against results |
| Hierarchical | Goals decompose cleanly | Sub-goals interact |
| Adaptive | The environment changes mid-task | Nothing bounds the replanning |

The best planner is not the one that writes the longest plan. It is the one that revises the plan when an observation contradicts an assumption — and stops replanning when it runs out of budget.

### Multi-agent: specialisation has a price

Splitting a job across specialised agents — research, analysis, execution, review — can sharpen focus and let each one carry a smaller context. It also buys coordination overhead, state synchronisation, conflicting decisions, more latency, more cost, and runs that are much harder to debug.

Multi-agent is not automatically more intelligent. If one well-built agent solves the problem reliably, five agents are five times the surface area for the same result.

When you do split, topology matters more than headcount. In a **mesh**, any agent can hand off to any other, and a run can wander in ways nobody can reconstruct afterwards. In a **star**, one orchestrator routes and specialists do the work, so every run has a single, recordable path.

> [!EVIDENCE]
> The portfolio agent is a star: a triage orchestrator and four specialists — portfolio, error solving, learning and teaching — on the OpenAI Agents SDK. Specialists hold no handoffs, so only the orchestrator routes, every run is exactly one hop, and the route is written into typed state. That is what makes the routing testable, and explainable after the fact.

The [Graph Engineering roadmap](/blog/graph-engineering-with-claude) goes much deeper on this layer: fan-out, verification and convergence across a fleet.

### Orchestration is the backbone

The orchestration layer owns the state no single step owns: execution steps, tool calls, retries, timeouts, permissions, approvals, memory access and the trace. It is where a prototype starts becoming a system. It is also the layer most demos skip.

## The whole picture

Put together, the model sits *inside* the architecture, not above it:

| Layer | Responsibility | Discipline |
|---|---|---|
| Experience | Where the goal comes from; where the result goes | — |
| Orchestration | Routing, state, retries, approvals | Graph |
| Reasoning and planning | Deciding the next step | Graph |
| Context and memory | What the model sees right now | Harness |
| Tools and data | What the agent can affect | Harness |
| Policy and permissions | What it is *allowed* to affect | Harness |
| Observation and evaluation | What happened, and whether it was good | Loop |
| Models and inference | Generating the decisions | — |

Agentic AI is not a single technology. It is a stack of interacting layers, and most of them are ordinary, deterministic software.

## Production reality: sufficient reasoning, not maximum reasoning

A prototype can afford inefficiency. A production system pays for every reasoning cycle in latency, in cost, and in one more chance to fail.

So the target is not maximum reasoning. It is *sufficient* reasoning for reliable completion: smaller models for simple steps and larger ones for hard judgment, caching, compressed tool results, early termination, bounded iteration, parallelism where it is safe, and deterministic code wherever a rule will do.

> [!EVIDENCE]
> The streaming chat widget on this site pins a "lite" model on purpose. The larger models in the same family reason before answering: they spent the output budget thinking and pushed the serverless function past its time limit. The more capable model made the product worse. The reason is recorded next to the pin, so nobody "upgrades" it without re-measuring.

## Failure modes, and where each one is fixed

| Failure | What you see | Architectural answer |
|---|---|---|
| Unbounded loop | Cost spikes, no result | Termination criteria and hard limits |
| Fluent evasion | A plausible answer with no tool call behind it | Trace-level evaluation |
| Stale or conflicting facts | Confident, wrong actions | A system of record with authority rules |
| Over-permissioned tools | A "helpful" destructive action | Read-only by default; approval for high-risk actions |
| Guardrail bypass through fallback | Refused requests answered anyway | Tripwires treated as results, not errors |
| Mesh routing | Runs nobody can explain | A star topology with a recorded route |
| Provider outage | Spinners and 500s | A degradation ladder |

Almost none of these are fixed by a better model.

## The design principle

The most common mistake in agentic engineering is treating the model as the whole system. A model can reason. It cannot, on its own, guarantee correct permissions, reliable state, transactional integrity, security boundaries, observability, recovery, or compliance with business rules. Those belong to the architecture around it.

**Let the model decide where judgment is valuable. Let software enforce what must be reliable.**

That division — probabilistic intelligence inside deterministic engineering — is the foundation of production agentic systems. It changes the human role rather than removing it: people increasingly define the objectives, constraints, policies, approval boundaries and success criteria, while the system carries more of the execution.

The question that defines the field is not *"can an AI agent act on its own?"* It is whether we can engineer one that acts independently while staying observable, accountable, and aligned with the goal it was given.

## Key takeaways

- An agent is a control loop with a model inside it. Most of what makes it trustworthy lives outside the model.
- Choose the least autonomy that solves the problem: automation, then workflow, then agent.
- **Harness:** scope context, tools and permissions in code. Read-only by default; deterministic guardrails first.
- **Loop:** observe every consequential action, stop on explicit criteria, and evaluate the trajectory — not only the answer.
- **Graph:** plan adaptively within a budget, and prefer a star with a recorded route over a mesh.
- Memory is not truth. An agent that acts needs a system of record — which is where [the next article](/blog/ksor-knowledge-system-of-record) picks up.

## Further reading

- Anthropic, [*Building effective agents*](https://www.anthropic.com/engineering/building-effective-agents) (2024) — the workflow/agent distinction, and the case for starting simple.
- [Model Context Protocol](https://modelcontextprotocol.io) — the open specification for tool and context interoperability.
- [OpenAI Agents SDK documentation](https://openai.github.io/openai-agents-python/) — agents, handoffs, guardrails and tracing.
