# Portfolio promotion: launch materials and evidence gates

Prepared 2026-09-25, updated 2026-10-14. Drafts below are not published. Connection instructions live in the existing ConnectMcp section (`#connect-mcp`); the live MCP endpoint was verified 2026-10-14 (see §1). Deployment of the updated section is outstanding.

## 1. Ask Claude about me

Directory listing draft for Smithery, mcp.so, and Glama:

- Name: Asadullah Shafique — Portfolio MCP
- Description: Query Asadullah Shafique's curated professional portfolio through six read-only tools covering skills, projects, background, hackathons, agent engineering, and contact details.
- Transport: Streamable HTTP
- Endpoint: `https://asadullahshafique-devunity.onrender.com/mcp/server/`
- Source: https://github.com/asadullah48/asadullahshafique_devunity/tree/main/backend
- Landing page after deployment: https://asadullahshafique-devunity.vercel.app/#connect-mcp
- Tools: `get_skills`, `get_projects`, `get_contact`, `get_about`, `get_hackathons`, `get_agent_engineering`.
- Caveat: The first request can take about a minute while the server wakes; retry if it times out. Portfolio data is owner-curated, not independent verification.

**Live MCP check: VERIFIED 2026-10-14** (curl, plain JSON-RPC POSTs to the endpoint above, `Accept: application/json, text/event-stream`; these three calls hit a warm server; the cold start was measured separately, below):

- `initialize` → HTTP 200 in 0.65s, `text/event-stream`, no `mcp-session-id` header (stateless). Trimmed result: `{"protocolVersion":"2025-03-26","capabilities":{"prompts":{…},"resources":{…},"tools":{"listChanged":false}},"serverInfo":{"name":"asadullah-portfolio","version":"1.26.0","websiteUrl":"https://asadullahshafique-devunity.vercel.app"},"instructions":"Tools for querying Asadullah Shafique's professional portfolio … All tools are read-only and take no arguments. …"}`
- `tools/list` → HTTP 200 in 1.02s. Tools: `get_skills`, `get_projects`, `get_contact`, `get_about`, `get_hackathons`, `get_agent_engineering`.
- `tools/call` `get_skills` → HTTP 200 in 0.41s, `isError: false`. Trimmed content: `{"languages":["TypeScript","JavaScript","Python"],"frameworks":["Next.js","React","FastAPI"],"data":["PostgreSQL","Supabase","Redis"],"ai_tools":["OpenAI Agents SDK","Claude MCP","LangGraph","RAG"],"devops":["Docker","Kubernetes","GitHub Actions"],"methodology":"Spec-first development (SpecifyKit)", …}`
- No-slash variant `…/mcp/server` (same three calls, redirects not followed) → HTTP 307 on all three, `location: https://asadullahshafique-devunity.onrender.com/mcp/server/`. The site and these drafts therefore use the trailing-slash URL; a client that does not follow a 307 on POST would fail on the no-slash form.

- Cold start, measured 2026-10-14: after ~20 min with no requests from this machine, `initialize` at 10:51:23Z returned HTTP 200 with time-to-first-byte 51.55s (TCP connect 0.12s); an immediate follow-up took 0.90s. One sample, so "about a minute" is an observation, not a guaranteed ceiling.

Not verified by this check: connecting through the Claude or Cursor UI. Check each directory's current submission process and record the resulting listing URL. Listings are not guaranteed permanent or accepted.

LinkedIn draft, to use after deployment and a successful connection:

> Don't just read my CV. Connect it to Claude and ask it about me.
>
> My portfolio exposes six read-only MCP tools: skills, projects, background, hackathons, agent engineering, and contact details.
>
> Try asking: “Which projects demonstrate agent orchestration experience? What evidence is available, and what is missing?”
>
> The data comes from my curated portfolio. The server can need time to wake up. Both limitations belong next to the demo.
>
> Connection instructions: https://asadullahshafique-devunity.vercel.app/#connect-mcp

## 2. Break my agent — not launch-ready

Not launch-ready. Prerequisites are tracked privately; do not build, link, or announce this until they are met.

## 3. Three public audit samples

Select three public repositories only after checking their current code, contribution guidelines, and maintainer interest. Do not imply any audit has already happened.

Use the same scorecard for each: routing decisions, tool permissions and argument validation, guardrail coverage across fallback paths, and traceability from answer to evidence. For every finding capture commit SHA, exact trigger, expected/actual result, minimal reproduction, impact, and a proposed regression test. Separate confirmed findings from hypotheses. Report security-sensitive findings privately according to the project's policy.

Issue draft structure: “At commit [SHA], [input] follows [path] and produces [result]. Expected [behavior] because [contract]. Reproduction: [commands]. Suggested fix: [small change]. Validation: [regression test].”

Summary CTA: “This audit examines a specific revision and scope. If you want the same evidence-led review of your agent system, my Agentic System Audit covers routing, tools, guardrails, and failure recovery.”

## 4. Honesty as the story

Do not reuse “41 tests · 33 pass” or the historical red eval as current results without rerunning the relevant suite and retaining its report.

Post template: “My portfolio shows a failing evaluation. At [commit/date], [case] expected [behavior] and got [actual result]. Here is the reproduction and its practical impact. I am keeping that result visible until the fix passes the same test.”

Follow-up template: “The failure is fixed in [commit]. The original case now passes, and [additional regression] checks the neighboring failure mode. Here is what remains untested.”

## 5. Arabic and textile content

Arabic MCP post draft, after live verification:

> لا تكتفِ بقراءة سيرتي الذاتية. اربط ملفي المهني بـ Claude واسأله عن المشاريع والأدلة.
>
> بنيت خادم MCP بست أدوات للقراءة فقط، لعرض المهارات والمشاريع والخلفية المهنية ومنهجي في هندسة الوكلاء وبيانات التواصل. هذه بيانات أُحدّثها بنفسي؛ اطلب من المساعد توضيح ما تثبته وما لا تثبته.
>
> قد يحتاج الخادم إلى بعض الوقت للاستيقاظ عند أول اتصال.
> https://asadullahshafique-devunity.vercel.app/ar#connect-mcp

Textile article outline: one real production-tracking task in a Faisalabad garment unit; the current Excel/WhatsApp handoff; a consented, anonymized CMT walkthrough; what the software actually does today; what still needs a person. Measure time/error changes before making outcome claims. Keep this Texcot story separate from hackathon achievements and digital marketing client work. Prepare association outreach only after assembling that evidence.

## 6. GitHub and flagship videos

Candidate pins, subject to a fresh public-repository check: OrchestratorX, GuardrailAI, ProtoBridge, DevUnity, AI TradeFlow, and the strongest publicly accessible textile or marketplace repository. Verify exact URLs, README setup steps, licenses, and current demo health before changing pins.

Profile README draft:

> # Asadullah Shafique
> Agentic AI developer and textile business founder, based in Pakistan and available for UAE engagements.
>
> I build agent orchestration, tool integrations, guardrails, and software for real operational workflows.
>
> Explore my projects, engineering evidence, and contact details: https://asadullahshafique-devunity.vercel.app/
>
> Connect my portfolio to your AI: https://asadullahshafique-devunity.vercel.app/#connect-mcp

90-second recording structure for each verified flagship: 0–10s user problem; 10–25s architecture and one meaningful constraint; 25–60s a real recorded workflow; 60–80s a failure and its test/trace; 80–90s source/demo link and next step. Use actual screen recordings, caption them, and distinguish measured results from illustrative diagrams. No recordings were produced in this session.
