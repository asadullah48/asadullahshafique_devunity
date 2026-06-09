# Agentic OS Portfolio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade asadullahshafique.dev to feel like an Agentic OS — animated stats, multi-mode AI chat with thinking steps, skills regrouped by agent role, and a polish pass.

**Architecture:** Pure frontend changes to Hero, AIChatAgent, and Skills components. The stream route already passes the full POST body through to FastAPI, so sending `mode` in the body requires no route changes. FastAPI can optionally use `mode`; frontend degrades gracefully if it doesn't.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Lucide React

---

## Task 1: Hero — Count-Up Stats Animation

**Files:**
- Modify: `src/components/Hero.tsx` (lines 173–276, stats section)

**Step 1: Add `useCountUp` hook inside `Hero.tsx` above `HeroSection`**

```tsx
function useCountUp(target: number, duration = 1800, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);
  return count;
}
```

**Step 2: Convert static stats to numeric + suffix**

Replace the static `stats` array (line 173) with:

```tsx
const STATS = [
  { target: 467, suffix: "+", label: t("hero.stats.repos")     },
  { target: 6,   suffix: "",  label: t("hero.stats.hackathons") },
  { target: 85,  suffix: "%", label: t("hero.stats.codeReuse")  },
  { target: 149, suffix: "+", label: t("hero.stats.tests")      },
];
```

**Step 3: Add `useInView` ref and wire count-up to stats grid**

At the top of `HeroSection`, add:
```tsx
const statsRef = useRef<HTMLDivElement>(null);
const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
```

Import `useInView` from `"framer-motion"` (add to existing import on line 6).
Import `useRef` from `"react"` (add to existing react import on line 3).

**Step 4: Add `StatCounter` sub-component above `HeroSection`**

```tsx
function StatCounter({ target, suffix, label, inView }: {
  target: number; suffix: string; label: string; inView: boolean;
}) {
  const count = useCountUp(target, 1600, inView);
  return (
    <div className="text-center lg:text-left">
      <div className="text-2xl font-bold text-white tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
```

**Step 5: Replace stats render in `HeroSection`**

Replace the existing stats `map` block (lines 266–276) with:

```tsx
<div ref={statsRef} className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
  {STATS.map((s, i) => (
    <div key={s.label} className="flex items-center gap-6">
      {i > 0 && <div className="w-px h-8 bg-white/10" />}
      <StatCounter {...s} inView={statsInView} />
    </div>
  ))}
</div>
```

**Step 6: Visual check**
Run `npm run dev`, open `http://localhost:3000` — scroll to hero, numbers animate up from 0 to target.

**Step 7: Commit**
```bash
git add src/components/Hero.tsx
git commit -m "feat: animate hero stats count-up on scroll-into-view"
```

---

## Task 2: Hero — Agent Mode Indicator Strip

**Files:**
- Modify: `src/components/Hero.tsx` (right column, after `TerminalCard`)

**Step 1: Add `AGENT_MODES` constant and `AgentModeStrip` component inside `Hero.tsx`**

Add above `HeroSection`:

```tsx
const AGENT_MODES = [
  { id: "general", label: "Portfolio Guide", color: "#9CE630" },
  { id: "python",  label: "Backend Expert",  color: "#009688" },
  { id: "nextjs",  label: "Frontend Arch",   color: "#3178C6" },
  { id: "agents",  label: "Agent Builder",   color: "#CC785C" },
] as const;

function AgentModeStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="w-full max-w-xs"
    >
      <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-2 px-1">
        // available_agents
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {AGENT_MODES.map((mode) => (
          <div
            key={mode.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono"
            style={{
              borderColor: `${mode.color}30`,
              backgroundColor: `${mode.color}08`,
              color: mode.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: mode.color }}
            />
            {mode.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
```

**Step 2: Mount `AgentModeStrip` in the right column**

In `HeroSection`, in the right-column `motion.div`, add after `<TerminalCard />`:

```tsx
<MonogramAvatar />
<TerminalCard />
<AgentModeStrip />
```

**Step 3: Visual check**
Right column shows 4 agent mode pills below the terminal card, each color-coded.

**Step 4: Commit**
```bash
git add src/components/Hero.tsx
git commit -m "feat: add agent mode strip to hero right column"
```

---

## Task 3: AIChatAgent — Mode Selector Tabs

**Files:**
- Modify: `src/components/AIChatAgent.tsx`

**Step 1: Add `AgentMode` type and `MODES` constant after the `Message` interface**

```tsx
type AgentMode = "general" | "python" | "nextjs" | "agents";

const MODES: { id: AgentMode; label: string; emoji: string; color: string }[] = [
  { id: "general", label: "Guide",   emoji: "🤖", color: "#9CE630" },
  { id: "python",  label: "Python",  emoji: "🐍", color: "#009688" },
  { id: "nextjs",  label: "Next.js", emoji: "⚡", color: "#3178C6" },
  { id: "agents",  label: "Agents",  emoji: "🧠", color: "#CC785C" },
];
```

**Step 2: Add `mode` state inside `AIChatAgent`**

```tsx
const [mode, setMode] = useState<AgentMode>("general");
```

**Step 3: Send `mode` in fetch body**

In `handleSubmit` (line 54), change:
```tsx
body: JSON.stringify({ message: userMsg }),
```
to:
```tsx
body: JSON.stringify({ message: userMsg, mode }),
```

**Step 4: Add mode tabs to chat UI**

After the closing `</div>` of the header gradient block (around line 183), add:

```tsx
{/* Mode Tabs */}
<div className="flex gap-1 px-3 py-2 border-b border-zinc-800 overflow-x-auto">
  {MODES.map((m) => (
    <button
      key={m.id}
      onClick={() => setMode(m.id)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
      style={
        mode === m.id
          ? { backgroundColor: `${m.color}25`, color: m.color, border: `1px solid ${m.color}60` }
          : { backgroundColor: "transparent", color: "#6b7280", border: "1px solid transparent" }
      }
    >
      <span>{m.emoji}</span>
      {m.label}
    </button>
  ))}
</div>
```

**Step 5: Update chat header subtitle to reflect active mode**

Change the subtitle `<p>` (line 171):
```tsx
<p className="text-xs text-black/80">Claude + LangGraph Agent</p>
```
to:
```tsx
<p className="text-xs text-black/80">
  {MODES.find((m) => m.id === mode)?.emoji}{" "}
  {MODES.find((m) => m.id === mode)?.label} Mode
</p>
```

**Step 6: Visual check**
Open chat widget — 4 mode tabs visible. Switch modes — header subtitle updates to active mode.

**Step 7: Commit**
```bash
git add src/components/AIChatAgent.tsx
git commit -m "feat: add multi-mode selector tabs to AI chat agent"
```

---

## Task 4: AIChatAgent — Thinking Steps Indicator

**Files:**
- Modify: `src/components/AIChatAgent.tsx`

**Step 1: Add thinking steps constants and state inside `AIChatAgent`**

```tsx
const THINKING_STEPS = [
  "Searching knowledge base...",
  "Retrieving project data...",
  "Analyzing context...",
  "Composing response...",
];
const [thinkingStep, setThinkingStep] = useState(0);
```

**Step 2: Add effect to rotate thinking steps while loading**

```tsx
useEffect(() => {
  if (!isLoading) return;
  const interval = setInterval(() => {
    setThinkingStep((s) => (s + 1) % THINKING_STEPS.length);
  }, 1200);
  return () => clearInterval(interval);
}, [isLoading]);
```

**Step 3: Reset `thinkingStep` on new message**

In `handleSubmit`, after `setIsLoading(true)`:
```tsx
setThinkingStep(0);
```

**Step 4: Replace static loader with animated thinking steps**

Find the `isLoading && !streamingContent` block and replace its content:

```tsx
{isLoading && !streamingContent && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-zinc-800 px-3 py-2 rounded-lg flex items-center gap-2">
      <Loader2 className="w-3 h-3 animate-spin text-zinc-400 flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={thinkingStep}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-zinc-400 font-mono"
        >
          {THINKING_STEPS[thinkingStep]}
        </motion.span>
      </AnimatePresence>
    </div>
  </motion.div>
)}
```

**Step 5: Visual check**
Send a message — loader shows rotating text steps instead of just spinner.

**Step 6: Commit**
```bash
git add src/components/AIChatAgent.tsx
git commit -m "feat: rotating thinking-steps indicator in AI chat loader"
```

---

## Task 5: Skills — Agent Role View Toggle

**Files:**
- Modify: `src/components/Skills.tsx`

**Step 1: Add `AGENT_ROLE_GROUPS` constant above `SKILL_TABS`**

```tsx
const AGENT_ROLE_GROUPS: Record<string, Skill[]> = {
  "AI Agent Layer": [
    { name: "Claude / MCP",      custom: true, icon: "", badge: "MCP",  color: "#CC785C" },
    { name: "OpenAI Agents SDK", custom: true, icon: "", badge: "AGT",  color: "#10a37f" },
    { name: "LangChain",         custom: true, icon: "", badge: "LC",   color: "#1C3C3C" },
    { name: "RAG Systems",       custom: true, icon: "", badge: "RAG",  color: "#84cc16" },
    { name: "Prompt Eng.",       custom: true, icon: "", badge: "PE",   color: "#a855f7" },
    { name: "SKILL.md",          custom: true, icon: "", badge: "SKL",  color: "#84cc16" },
  ],
  "Backend Runtime": [
    { name: "Python",     icon: "python/python-original.svg",           color: "#3776AB" },
    { name: "FastAPI",    icon: "fastapi/fastapi-original.svg",         color: "#009688" },
    { name: "Docker",     icon: "docker/docker-original.svg",           color: "#2496ED" },
    { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg",   color: "#4169E1" },
    { name: "Redis",      icon: "redis/redis-original.svg",             color: "#FF4438" },
    { name: "Supabase",   custom: true, icon: "", badge: "SB",          color: "#3ECF8E" },
  ],
  "Frontend Interface": [
    { name: "Next.js",    icon: "nextjs/nextjs-original.svg",           color: "#ffffff" },
    { name: "TypeScript", icon: "typescript/typescript-original.svg",   color: "#3178C6" },
    { name: "React",      icon: "react/react-original.svg",             color: "#61DAFB" },
    { name: "Tailwind",   icon: "tailwindcss/tailwindcss-original.svg", color: "#06B6D4" },
    { name: "shadcn/ui",  custom: true, icon: "", badge: "UI",          color: "#ffffff" },
    { name: "Framer",     custom: true, icon: "", badge: "FM",          color: "#0055FF" },
  ],
  "Infrastructure": [
    { name: "Kubernetes",     icon: "kubernetes/kubernetes-original.svg",    color: "#326CE5" },
    { name: "GitHub Actions", icon: "github/github-original.svg",            color: "#ffffff" },
    { name: "Vercel",         icon: "vercel/vercel-original.svg",            color: "#ffffff" },
    { name: "Terraform",      icon: "terraform/terraform-original.svg",      color: "#7B42BC" },
    { name: "Kafka",          icon: "apachekafka/apachekafka-original.svg",  color: "#ffffff" },
    { name: "Grafana",        icon: "grafana/grafana-original.svg",          color: "#F46800" },
  ],
};
```

**Step 2: Add view toggle state in `SkillsSection`**

```tsx
type SkillView = "technology" | "role";
const [view, setView] = useState<SkillView>("technology");
```

**Step 3: Add toggle UI before the tabs `div`**

```tsx
{/* View Toggle */}
<div className="flex justify-center mb-6">
  <div className="flex bg-zinc-900 border border-zinc-800 rounded-full p-1 gap-1">
    {(["technology", "role"] as SkillView[]).map((v) => (
      <button
        key={v}
        onClick={() => setView(v)}
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
          view === v
            ? "bg-green-500 text-black shadow-[0_0_12px_rgba(132,204,22,0.35)]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        {v === "technology" ? "By Technology" : "By Agent Role"}
      </button>
    ))}
  </div>
</div>
```

**Step 4: Wrap existing tabs + grid in a conditional, add role view**

```tsx
{view === "technology" ? (
  <>
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {/* existing tab buttons unchanged */}
    </div>
    <AnimatePresence mode="wait">
      {/* existing motion.div grid unchanged */}
    </AnimatePresence>
  </>
) : (
  <div className="space-y-10">
    {Object.entries(AGENT_ROLE_GROUPS).map(([role, skills], groupIdx) => (
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: groupIdx * 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-green-400 uppercase tracking-widest">
            // {role.toLowerCase().replace(/ /g, "_")}
          </span>
          <div className="flex-1 h-px bg-green-500/15" />
          <span className="text-xs text-zinc-600">{skills.length} tools</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </motion.div>
    ))}
  </div>
)}
```

**Step 5: Visual check**
Toggle "By Technology" / "By Agent Role" — role view shows 4 groups with `// ai_agent_layer` style section headers.

**Step 6: Commit**
```bash
git add src/components/Skills.tsx
git commit -m "feat: add agent-role view toggle to skills section"
```

---

## Task 6: Portfolio Polish — Section Labels

**Files:**
- Modify: `src/components/About.tsx`, `src/components/Projects.tsx`, `src/components/Hackathons.tsx`, `src/components/OpenSource.tsx`, `src/components/Contact.tsx`

**Step 1: Add mono section label above each `<h2>` section title**

Pattern to apply to each section:
```tsx
<div className="text-xs font-mono text-green-400/60 uppercase tracking-widest mb-3">
  // section_name
</div>
<h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
  ...existing title...
</h2>
```

Apply with labels:
- About → `// about`
- Projects → `// projects`
- Hackathons → `// hackathons`
- OpenSource → `// open_source`
- Contact → `// contact`

**Step 2: Visual check**
Each section has a small lime green mono label above the main heading.

**Step 3: Commit**
```bash
git add src/components/
git commit -m "style: add mono section labels to all major sections"
```

---

## Task 7: Final Build & Deploy

**Step 1: Build check**
```bash
npm run build
```
Expected: successful build (or only non-breaking warnings).

**Step 2: Deploy via Vercel CLI**
```bash
vercel --prod
```

**Step 3: Smoke test**
Visit `https://asadullahshafique-devunity.vercel.app`:
- [ ] Hero stats animate on scroll
- [ ] Agent mode strip visible in hero right column
- [ ] Chat widget shows 4 mode tabs
- [ ] Chat mode switch updates header subtitle
- [ ] Chat loading shows rotating thinking steps
- [ ] Skills section has "By Technology / By Agent Role" toggle
- [ ] Agent role view shows 4 groups with `//` headers
- [ ] All major sections have mono section label
