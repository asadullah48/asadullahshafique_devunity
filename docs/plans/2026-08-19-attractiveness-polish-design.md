# 2026-08-19 — Attractiveness & Trending Polish

Goal: make the portfolio visibly more attractive with trending 2026 patterns, zero new npm dependencies.

## Workstreams

### 1. Visual polish
- **SpotlightCard** (`src/components/SpotlightCard.tsx`): reusable mouse-tracking radial-glow wrapper (CSS custom properties + pointermove). Applied to Project cards.
- **Aurora hero**: two slow-drifting blurred lime/teal gradient blobs + SVG noise grain overlay behind the Hero (keyframes in `globals.css`, guarded by `prefers-reduced-motion`).
- **TechMarquee** (`src/components/TechMarquee.tsx`): infinite-scrolling stack strip (react-icons Si* logos, already a dependency) between Hero and About, edge-faded with CSS mask, pauses on hover.

### 2. Proof-of-work
- **GitHubHeatmap** (`src/components/GitHubHeatmap.tsx`): 52-week contribution grid in brand lime scale.
- Data: new route `src/app/api/github/contributions/route.ts` → proxies `github-contributions-api.jogruber.de/v4/asadullah48` with `revalidate: 3600`. Renders nothing on failure (same pattern as GitHubStatsStrip).
- Mount heatmap + the existing-but-unmounted `GitHubStatsStrip` in the Open Source section.

### 3. AI-native
- Chat agent already has suggestion chips; upgrade them to be **mode-aware** (different suggestions per agent mode: Portfolio Guide / Backend / Frontend / Agents).

### 4. Performance
- **FloatingWidgets** (`src/components/FloatingWidgets.tsx`): client wrapper that `next/dynamic`-loads AIChatAgent + WhatsAppButton with `ssr: false` so the floating widgets stay out of the server HTML and initial hydration path. Content sections stay SSR for SEO.

## Constraints
- No new dependencies; keep EN/AR support where sections are localized; dark theme identity (#9CE630 on zinc) unchanged.
