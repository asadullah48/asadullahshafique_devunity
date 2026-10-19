# One promotion plan: evidence of agentic AI delivery

Prepared 2026-10-19. Website deployment status is reported separately. The corrected LinkedIn post below was published on 2026-10-19: https://www.linkedin.com/feed/update/urn:li:activity:7517864486645592064/ . No competition registration or organizer outreach has been performed.

## Portfolio positioning

Lead with the engineering question: can this person understand an operational problem, build the integration, and verify the result?

The homepage now gives hiring teams three evidence routes:

1. **Business context:** CMT software in the author's own unit, supported by AI TradeFlow's inventory/accounting implementation. Do not present the TradeFlow demo as a customer deployment.
2. **Integration:** the portfolio's OpenAI Agents SDK orchestrator, read-only MCP server, and ProtoBridge architecture case study.
3. **Evaluation:** Atlas's small duplicate-purchase case and Rehearsal's deeper offline controller simulator. Preserve the synthetic-data and recorded-demo labels.

OpenAI's UAE Forward Deployed Engineer role emphasizes customer delivery, full-stack implementation, scoping, and reusable patterns. It also asks for 5+ years of relevant engineering or technical deployment experience, including customer-facing work. The portfolio shows relevant artifacts; it does not establish that every hiring requirement is met. Do not count textile experience automatically as software-engineering tenure or imply employment with OpenAI.

GitHub verification on 2026-10-19: **520 public repositories = 512 original + 8 forks**. The requested 523 could include repositories not visible publicly or a different snapshot; it is not the verified public count. Prefer project depth over a larger headline number.

## Entry-pack review

The supplied eight-page PDF is a planning document, not an organizer ruling. Its proposed instructions are recommendations requiring judgment. Useful: Business category, original work, narrow pilot, measured results. Correct before using publicly:

- The organizer's current page places registration close and prototype/pitch submissions in **January 2027**, with no exact closing day shown. The PDF's January 15 target is an internal target, not an official deadline, and is not guaranteed to be before the eventual closing date.
- The current page lists **USD 150,000 per category winner**, with extra funding for the overall title. Do not repeat an exact overall AED award without confirming the current terms.
- Entry is free; development costs remain yours. Free entry does not establish free travel or reimbursed finalist expenses. Do not rely on the pack's assertion that everything before the final is online.
- Grand Final entrants must demonstrate a working agent on stage. Current organizer timetable: first week of May 2027.
- The published rule says entries must be original and not copied or taken from an existing repository. A new repository alone does not establish compliance. Obtain written clarification before reusing your own code; no message has been sent.
- The claimed Dubai-company condition for receiving funding is secondary-source material in this pack. Confirm it in the actual grant terms before budgeting or making a company commitment.
- Do not call all 21 agent repositories production platforms. They are reference implementations unless separate operational evidence establishes otherwise.
- A hash chain can help detect changes relative to a trusted digest. It does not prove that a decision was correct, authorize an action, establish provenance by itself, or certify regulatory compliance.
- Do not claim Control Tower integration, certification, or compliance. The news is context for the engineering problem, not evidence that an oversight system accepts these projects.
- Named contacts, customer quotes, sourcing relationships, and pilot participation require confirmation and publication consent. Do not promote exploratory feedback as an agreed pilot or customer result.

## Recommended competition direction

**Category:** Best Business AI Agent. **Working concept:** TexFlow, a new approval-controlled assistant for garment quote preparation. This is proposed work, not a shipped capability.

Narrow the pack's full order-to-cash scope to one demonstrable loop:

Buyer request → structured draft → missing-information questions → quote from an approved rate card → named human approval → recorded authorized output.

Begin with a web form or uploaded text/PDF. WhatsApp integration, production tracking, invoicing, payment, and ERP synchronization are later scope. Use synthetic records for the public demo. Only introduce pilot data with consent and appropriate isolation.

Show an actual model extracting a structured request, deterministic validation, approved tool access, and a refusal when required details or approval are missing. Atlas and Rehearsal can demonstrate your testing approach; they are not themselves live-model competition entries, and should not be repackaged as the proposed business agent.

### Four sessions

1. **Foundation:** write SPEC-TEXFLOW.md with goal, input, output, rules, and edge cases. Define one buyer request, one approved rate card, and approval ownership. Resolve originality eligibility before reusing code.
2. **Integration:** implement structured extraction and validation. Test missing quantities, unknown fabrics, contradictory instructions, and untrusted document text. No external quote sending yet.
3. **Controls:** bind approvals to the exact quote version; invalidate approval after edits. Reject duplicate sends and unauthorized rate changes. Record tool inputs, outcomes, and approval evidence without exposing private data.
4. **Validation:** run the same fixtures against the evaluator, demonstrate one successful path and one rejected path, then produce a short demo and English pitch deck. State what is simulated and what uses a live model.

Pilot only after a working prototype: measure request-to-approved-quote time, correction rate, and required human touches. Preserve the sample size, baseline, dates, and failures. Do not invent savings or a customer endorsement. Budget model use and any travel separately.

Next actions: confirm the current submission deadline and originality rule; secure a consenting pilot partner; write the narrow spec. Do not publicly claim registration or entry until completed.

## LinkedIn post — revised from the pack and published

An AI agent can report success and still leave the business in the wrong state.

That’s the problem I’m building around.

Gulf News reported on 14 October that the UAE’s federal AI Control Tower will oversee government agents, with logging and continuous auditing. For me, the engineering question is practical: how do we check what an agent actually did?

Two projects on my portfolio make that question inspectable:

• Agent Failure Atlas: a lost purchase response triggers a duplicate order. Compare the vulnerable and repaired versions. 30 tests passing.
• Agent Rehearsal v1.0.0: an offline simulator for approval, budget, and retry rules, including a false-success claim rejected by an independent evaluator. 171 tests passing.

Both use scripted/offline scenarios and synthetic data. They demonstrate workflow checks, not production safety or integration with the UAE Control Tower.

My next proposed application is a garment quote assistant grounded in my CMT business experience: prepare the quote, validate the inputs, and require a person’s approval before any commitment. I’m assessing it for Dubai’s Create AI Agents Championship.

I’m open to Forward Deployed Engineer and Applied AI roles with UAE teams working on business workflows, tool integration, and evaluation.

Explore the projects and source under Engineering:
https://asadullahshafique-devunity.vercel.app/#projects

News context: https://gulfnews.com/business/economy/uae-reveals-control-tower-to-monitor-ai-government-agents-1.500710167

#AgenticAI #AIEngineering #UAE

## Sources and boundaries

- Official organizer first: https://www.dubaichamberdigital.com/en/create-ai-agents — current rules checked at the organizer's accessible page: https://www.dubaichambers.com/en/web/dubai-chamber-of-digital-economy/create-ai-agents (updated 15 October 2026). Current rules and timeline take precedence over launch reporting.
- Business Wire launch release: https://www.businesswire.com/news/home/20261008883373/en/Dubai-Launches-Global-Create-AI-Agents-Championship-with-Prize-Pool-Exceeding-AED-2.5-Million — supplied launch reference; not retrievable through this session's web reader. Do not treat it as current eligibility guidance.
- The National launch reporting: https://www.thenationalnews.com/news/uae/2026/10/07/dubai-launches-create-ai-agents-championship-with-prize-money-exceeding-dh25m/
- Khaleej Times launch reporting: https://www.khaleejtimes.com/uae/sheikh-hamdan-launch-create-ai-agents-championship-prizes — its December deadline is superseded by the current organizer page; its AED overall-prize amount is launch reporting, not an amount currently specified on the organizer page.
- Role: https://openai.com/careers/forward-deployed-engineer-uae-abu-dhabi-uae/
- News attribution: https://gulfnews.com/business/economy/uae-reveals-control-tower-to-monitor-ai-government-agents-1.500710167
- GITEX dates: https://www.gitex.com/plan-your-visit-2026 — summit December 7; expo December 8–11. No attendance or competition connection is claimed.
- Supplied source: Create AI Agents Championship — Entry Pack.pdf, pages 1–8. Reviewed as planning material; claims were checked against the current organizer page where available.

Keep the Atlas/Rehearsal launch video in `docs/agent-failure-atlas-launch.md` separate from a future competition submission video. The former shows existing evidence; the latter must show a working new agent.
