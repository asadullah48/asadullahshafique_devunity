# Blog distribution kit — LinkedIn and Medium

Announcement and cross-post copy for the four knowledge-hub articles published 2026-09-11.
The canonical version of every article is on the portfolio; external copies should point back to it.

**Canonical base:** `https://asadullahshafique-devunity.vercel.app/blog/<slug>`

## Cross-posting notes (read before pasting into Medium)

- Use Medium's **Import a story** with the canonical URL rather than pasting text. Import sets
  `rel=canonical` to the portfolio, so search engines credit the original.
- The site renders two markdown extensions Medium does not understand:
  - `> [!IMPLICATION]`, `> [!EVIDENCE]`, `> [!FAILURE]`, `> [!NOTE]`, `> [!ILLUSTRATIVE]` callouts →
    convert to a blockquote whose first words are bold: **Engineering implication:** …
  - ` ```flow ` fences → convert to a numbered list.
- Medium does not render markdown tables. Either keep them as images, or rewrite each as a short list.
- Internal links (`/blog/...`) must become absolute URLs.
- "In this codebase" callouts refer to the system behind the portfolio. On Medium, add one sentence
  linking to `https://github.com/asadullah48/asadullahshafique_devunity` so the claim stays checkable.

No engagement bait in any of the posts below: no "Agree?", no "Comment YES", no "Like and share".

---

## 1. The Architecture of Agentic AI

**Slug:** `architecture-of-agentic-ai`

### LinkedIn

> Two agents get the same task. Both return the same, correct answer.
>
> One took five steps. The other took twenty-five, called tools it never needed, and came close to a
> permission boundary it had no business approaching.
>
> Grade only the answer and they are the same system. In production, they are not.
>
> That gap is where agentic architecture lives — and very little of it is the model's job.
>
> I wrote up how I structure the system around the model, in three disciplines:
>
> → Harness: what the agent can see and touch, decided in code before the model gets a vote
> → Loop: how the system learns what actually happened — and why evals have to read the trace, not just the prose
> → Graph: how work flows, and why a star with one recorded route beats a mesh of agents calling agents
>
> Where a pattern is running in the system behind my portfolio, the article links to the source.
>
> https://asadullahshafique-devunity.vercel.app/blog/architecture-of-agentic-ai

### Medium

- **Title:** The Architecture of Agentic AI: Building Autonomous Systems That Think, Plan, and Act
- **Subtitle:** An LLM that answers is not an agent. A layer-by-layer look at the system around the model — harness, loop and graph — and the failure each layer exists to prevent.
- **Excerpt:** Two agents return the same correct answer. One is safe to deploy and one is not. The difference is not the model; it is everything built around it.
- **Tags:** AI Agents, Software Architecture, Artificial Intelligence, Machine Learning, Software Engineering

---

## 2. KSOR: The System of Record for Reliable Agentic AI

**Slug:** `ksor-knowledge-system-of-record`

### LinkedIn

> The facts about my own work used to live in three places in my portfolio's codebase.
>
> One fed the backend agent. One fed the MCP server. One fed the chat widget. Each was right the day it was
> written — and later, two of them were still describing an old project as current.
>
> Nobody lied. Nothing crashed. Three consumers were simply answering from three versions of reality.
>
> Scale that to an organisation with a dozen agents reading a CRM, an ERP and a document store, and it
> stops being embarrassing. It becomes an agent confidently taking the wrong action.
>
> The AI Agent Factory (Panaversity) names the missing layer a Knowledge System of Record. I wrote an
> engineer's reading of it:
>
> → why memory is not a system of record
> → why retrieval finds information but cannot establish authority
> → what a trustworthy fact carries: provenance, version, authority, epistemic status
> → why writes need propose → approve → commit
> → and an honest scorecard of how much of this my own system actually implements
>
> https://asadullahshafique-devunity.vercel.app/blog/ksor-knowledge-system-of-record

### Medium

- **Title:** KSOR: The System of Record for Reliable Agentic AI
- **Subtitle:** Memory tells an agent what it remembers. A system of record tells it what the organisation is prepared to stand behind.
- **Excerpt:** Agents fail quietly when they act on knowledge nobody governs. What a Knowledge System of Record is, how it differs from memory and vector retrieval, and what it takes to build one.
- **Tags:** AI Agents, Knowledge Management, Data Governance, Artificial Intelligence, Software Architecture
- **Attribution line to keep in the Medium version:** "The term Knowledge System of Record comes from Panaversity's *The AI Agent Factory*."

---

## 3. The Psychology of Killer Hooks & Addictive Storytelling

**Slug:** `psychology-of-hooks-and-storytelling`

### LinkedIn

> "In today's rapidly evolving technological landscape…"
>
> Every word of that sentence is defensible. Almost nobody reads past it.
>
> Readers don't commit to an article. They commit to a sentence — and then, if it earned it, to the next one.
> A first line's job isn't to summarise. It's to make a promise worth the next five seconds.
>
> I wrote about why some ideas hold attention and others are ignored — and why it matters to engineers:
>
> → the information gap, and why curiosity needs some knowledge first
> → stakes and specificity: "three weeks of cash" versus "running out of money"
> → the same mechanics in onboarding, design docs, READMEs and AI interfaces
> → and the line between persuasion and manipulation: whether the promise is kept
>
> Research is cited where it exists; craft convention is labelled as craft.
>
> https://asadullahshafique-devunity.vercel.app/blog/psychology-of-hooks-and-storytelling

### Medium

- **Title:** The Psychology of Killer Hooks & Addictive Storytelling
- **Subtitle:** Why some ideas hold attention while others are ignored — and how the same mechanics apply to products, docs, AI interfaces and architecture reviews.
- **Excerpt:** Most openings fail in the first sentence, not because they are badly written but because they make no promise.
- **Tags:** Writing, Storytelling, Psychology, Technical Writing, Product Design

---

## 4. Changing the Game: Negotiation and Competitive Decision-Making

**Slug:** `negotiation-and-competitive-decision-making`

### LinkedIn

> Most negotiations are decided before anyone sits down.
>
> Not by who talks better — by what each side would do if the talks failed, and by the biases neither side
> noticed in themselves.
>
> Negotiation is usually taught as tactics. I think it is better understood as a decision problem:
> two parties choosing under uncertainty, with incomplete information and predictable errors of judgment.
>
> The article works through seven capabilities:
>
> → knowing where your own judgment fails
> → changing your decision process, not just naming biases
> → preparing around alternatives and interests, not positions
> → creating value without giving it away
> → negotiating as a team with one voice
> → staying steady when emotions run high
> → adapting when incentives change — and reviewing the deal afterwards
>
> https://asadullahshafique-devunity.vercel.app/blog/negotiation-and-competitive-decision-making

### Medium

- **Title:** Changing the Game: Negotiation and Competitive Decision-Making
- **Subtitle:** Most negotiations are decided before anyone speaks. A practical framework for preparing, creating value, running a team and learning from the result.
- **Excerpt:** Tactics matter at the margin. The larger lever is treating negotiation as a decision problem between parties with incomplete information and predictable biases.
- **Tags:** Negotiation, Decision Making, Leadership, Psychology, Business Strategy
