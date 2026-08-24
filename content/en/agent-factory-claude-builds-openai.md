---
slug: agent-factory-claude-builds-openai
lang: en
dir: ltr
title: "Agent Factory: How Claude Code Builds OpenAI Agents at Scale"
excerpt: "Two-tier architecture where a General Agent (Claude Code) manufactures Custom Agents (OpenAI Agents SDK) using SKILL.md files as portable, monetizable intelligence units. The Digital FTE model explained."
author: "Asadullah Shafique"
date: 2025-05-01
displayDate: "May 2025"
readTime: "15 min read"
tags: ["Agentic AI", "SKILL.md", "OpenAI SDK", "Digital FTE"]
accentColor: "#a855f7"
---

There are two agents in this architecture and only one of them ships.

The first is Claude Code. It never reaches a customer. Its job is to build the second one — scaffold it, wire its tools, write its evals, containerize it, and hand it to Kubernetes. The second is an OpenAI Agents SDK application that does exactly one thing for exactly one customer, and knows nothing about how it was made.

That separation is the entire idea behind H5, the Agent Factory round of the Panaversity series. Most people building with agents are building *an* agent. The factory question is different: what does the machine that produces agents look like, and what is the unit it stamps out?

The answer I landed on is a file. Specifically, a `SKILL.md`.

## The two tiers, and why they use different tools

| | Tier 1 — General Agent | Tier 2 — Custom Agent |
|---|---|---|
| **Runtime** | Claude Code | OpenAI Agents SDK |
| **Lifetime** | Development time | Production, continuous |
| **Scope** | Any project | One narrow job |
| **Sees the customer** | Never | Always |
| **Optimized for** | Breadth, filesystem, tools | Latency, cost, predictability |

Using two different vendors' tooling here is deliberate, not indecision.

Claude Code is a development-time agent. It has a filesystem, a shell, and the willingness to grind through a forty-step refactor. It is a general contractor. You want breadth, tool access, and long-horizon reasoning, and you do not much care that a session costs real money, because it runs once and produces a durable artifact.

An OpenAI Agents SDK application is a production runtime. It runs thousands of times a day against one narrow task. You want the opposite properties: bounded scope, predictable latency, low cost per call, structured output you can validate. Breadth is a liability here — a production agent that *could* do anything is a production agent that will eventually do something you did not intend, at 3am, to a paying customer.

Conflating these is the most common architectural mistake I see. People take the general contractor and try to ship it, then wonder why their support bot is capable of writing files.

## A `SKILL.md` is the unit the factory stamps out

The interesting artifact is not the agent. It is the thing that makes the agent.

A `SKILL.md` is a plain markdown file that packages one capability: what the capability is, when it should trigger, the procedure to follow, the constraints on it, and how to know it worked. It is meant to be read by an agent, not compiled.

Three properties make it the right unit:

**It is portable.** Markdown has no runtime. The same file can brief Claude Code during construction and be compiled into a production agent's instructions. Move it between projects by copying it.

**It is reviewable by non-engineers.** This is underrated. The domain expert who actually knows how invoices get approved can read a `SKILL.md`, correct it, and hand it back. They cannot do that with a Python class. When the expensive knowledge in your business lives in people who do not write code, the format of your capability unit determines whether their knowledge can reach your system at all.

**It is sellable.** A file with a defined job and stated boundaries is a thing you can put a price on. That is where the factory model stops being an engineering pattern and starts being a business model.

The discipline that makes them work is narrow triggers. A skill that says "use this for customer questions" is useless — everything is a customer question. A skill that says "use this when the customer has already been charged and is asking for a refund, and the order is under 30 days old" is a skill an agent can actually route to correctly. Write the trigger like you are writing a routing rule, because you are.

<!-- [VERIFY] I've described the `SKILL.md` format at the level of principle. If H5's had a fixed schema — required headings, frontmatter keys, a validator — paste it and I'll document the actual contract instead of the idea of one. -->

## MCP for tools, A2A for agents

Two protocols show up constantly in this space and they solve different problems. Getting them straight matters more than it might seem.

**MCP (Model Context Protocol)** standardizes how an agent reaches a *tool*. Instead of writing a bespoke HTTP integration for every capability, you expose the capability as an MCP server, and any MCP-speaking client can discover and call it. The handshake is the substance: a real MCP server negotiates capabilities on `initialize`, advertises its tools via `tools/list`, and executes them via `tools/call`.

Worth being precise here, because the term gets abused. A REST endpoint shaped like a tool is not an MCP server. If there is no handshake and no capability negotiation, it is an HTTP API with aspirational naming. I have shipped both, and I have had to go back and correct my own documentation for exactly this reason — the shim came first, the real server came later, and for a while the README described a thing that did not exist.

Two settings turned out to matter in production. If you run more than one worker, session state held in-process will break you: a client can complete its handshake on worker A and have the next request land on worker B, which has never heard of it. Either run stateless or put session state somewhere shared. And if you mount an MCP server as a sub-application inside a larger web app, its lifespan does not run on its own — the host has to start the session manager explicitly. Skip that and every request dies with a task-group error that tells you nothing useful.

**A2A (Agent-to-Agent)** is the other axis: how one *agent* delegates to another agent, as a peer rather than as a tool. MCP answers "what can I call?" A2A answers "who can I hand this to?"

In a factory model that distinction is structural. Tier 1 and Tier 2 do not talk to each other at runtime at all — the relationship is manufacturer to product, and it ends at deployment. But once you have many Tier 2 agents in production, the question of whether the refunds agent can delegate to the fraud-check agent is exactly an A2A question.

<!-- [VERIFY] You listed A2A as a term to preserve in the translation, so I've given it a real section. But the H5 card lists MCP and not A2A in its stack. Tell me whether H5 actually implemented A2A or whether it was discussed as direction, and I'll adjust the framing — right now I've written it as the conceptual counterpart to MCP, which is defensible either way. -->

## The gotcha that costs an afternoon

A specific, hard-won detail for anyone adopting the OpenAI Agents SDK.

The wheel installs a **top-level module named `agents`**. If your application runs with its own directory first on `sys.path` — which is the normal case for a service started from its own folder — then creating a package at `yourapp/agents/` shadows the SDK entirely. `from agents import Agent` then imports *your* package, and the failure surfaces as an import error or a missing attribute that looks nothing like a naming collision.

Name the directory something else. `orchestration/` works. This is thirty seconds of prevention against an afternoon of confusion, and it is the kind of thing that only appears in someone's notes after it has already happened to them.

One more, in the same spirit: the SDK's tracing uploads to the vendor's platform **by default**. If your agent handles anything you would not want leaving your infrastructure, turn it off explicitly and write down that you did. Defaults are decisions someone else made about your data.

## Digital FTE: pricing the output, not the tokens

Here is where the architecture becomes a business model, and it traces back further than H5 — the Digital FTE framing was already there at H1, in a course companion built as a full-time employee rather than as a feature.

The standard way to price an AI product is per seat or per token. Both anchor the buyer to the wrong comparison. Per-token invites them to compare you against raw model pricing, where you always look expensive because you are charging for the model plus your work. Per-seat invites them to compare you against SaaS, where you look expensive because SaaS does not have your inference costs.

**Digital FTE** anchors to a different number: what does it cost to have a person do this job? A narrow, well-scoped agent that handles first-line support triage is not competing with an API. It is competing with a fraction of a headcount. That comparison is enormously more favorable, and — more importantly — it is the comparison the buyer is already making internally, whether or not you frame it for them.

Two things make the framing legitimate rather than a pricing trick:

**Scope has to be honestly bounded.** An FTE has a job description. Your agent needs one too, including what it escalates and what it refuses. Selling "an employee" that silently fails outside its lane is how you lose the account.

**Unit economics have to close.** You are now quoting a fixed-ish price against variable inference cost. Know your cost per resolved task, not per call, and know it at the tail — the pathological conversation that loops fifteen times is the one that decides whether the model works.

This is also precisely why Tier 2 uses the constrained runtime. A Digital FTE priced against headcount only works if its cost per task is predictable, and cost predictability comes from narrow scope and structured output.

## Deployment: Kubernetes and Dapr

The factory output ships to Kubernetes, with Dapr in front of the cross-service concerns.

Kubernetes is the unglamorous answer and it is the right one, because a Digital FTE is a long-lived service with real availability expectations, not a script. You need rollouts you can reverse, secrets that are not in the image, and horizontal scaling when a customer's Monday morning arrives.

Dapr earns its place by keeping the agent code ignorant of its own infrastructure. State stores, pub/sub, and service invocation are reached through a sidecar, so the agent calls a local endpoint and the platform decides whether that is Redis or Postgres, Kafka or something else. That indirection matters in a factory more than in a single application: agents are being produced continuously, and you do not want each one hard-coding a broker choice that the platform team later has to migrate across forty services.

The observability stack — Prometheus, Grafana, Jaeger — is not optional here for a reason specific to agents. When a normal service is slow you profile it. When an agent is slow, or wrong, the cause is usually a decision: it called four tools where one would do, or routed to the wrong skill, or looped. Distributed tracing is how you see the decision sequence. Without it you are reading final outputs and guessing at the reasoning that produced them.

## Distribution is the part engineers skip

H5 targeted the OpenAI Apps ecosystem as its distribution channel, on the reasoning that meeting users inside an assistant they already use beats asking them to adopt another destination.

<!-- [VERIFY] The 800M-user figure comes from the H5 project card. It should be attributed and dated before publishing — ecosystem numbers move fast and an unsourced one is the easiest thing in this article for a skeptical reader to attack. -->

The structural point survives whatever the number is. An agent has an unusual distribution property: it is most valuable at the moment a user is already describing their problem in natural language. That moment happens inside assistants, not on your marketing site. Building a great agent and then requiring users to discover a separate product to reach it discards the advantage.

Which is also why the packaging matters. A capability defined as a portable `SKILL.md`, exposed through a standard tool protocol, can be dropped into whichever surface has the users — this year's assistant ecosystem, next year's. A capability tangled into a bespoke web app goes where that web app goes, which is nowhere.

## Where this model strains

Three honest limits.

**The factory is only as good as its specs.** A `SKILL.md` written vaguely produces a vague agent, faster than before. Generation speed multiplies whatever quality your inputs have, including the bad kind. The bottleneck moves from writing code to writing precise descriptions of work — which is a real skill, unevenly distributed, and not obviously easier.

**Evaluation does not come free with the agent.** Producing agents quickly makes it tempting to skip measuring them. The failure mode that actually bites is subtle: the agent answers fluently *from memory* instead of calling the tool that holds the real data. It sounds right. A human reviewer nods. A judge model scoring only the prose gives it a 4. The only thing that catches it is asserting on the trace — which tool was called, in what order — and that requires you to have built the run so its decisions are inspectable. Design for that at the start; retrofitting it is miserable.

**Two vendors is two blast radii.** Tier 1 and Tier 2 depend on different companies' pricing, availability, and terms. That is a real operational cost, accepted here because each tool is genuinely better at its half. It is not free and you should not pretend otherwise to a buyer.

## Takeaways

- **Separate the agent that builds from the agent that ships.** Different lifetimes, different scopes, different optimization targets. Do not ship the general contractor.
- **Make your capability unit a file, not a class.** Portable, reviewable by domain experts, and priceable.
- **Write narrow triggers.** A skill that could apply to anything gets routed to at random.
- **Know the difference between MCP and A2A.** Tool access versus peer delegation. And do not call an HTTP endpoint an MCP server — the handshake is the thing.
- **Price against headcount, and make the unit economics close at the tail.**
- **Trace the decisions, not just the outputs.** A fluent answer that skipped its tool is the failure your eval will miss.
