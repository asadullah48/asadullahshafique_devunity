# Legacy Route Positioning Audit

Audited: 2026-09-14  
Primary identity: **Agentic AI Systems Engineer**  
Decision rule: every indexed route must strengthen that identity, clearly belong to the DevUnity product, or be removed from discovery.

| Route | Current role | Classification | Recommended treatment |
|---|---|---|---|
| `/about` | General DevUnity community pitch | Conflicts with portfolio identity | Rewrite as a professional biography focused on agentic systems and operational experience |
| `/community` | General developer community | Useful, but weakly differentiated | Keep; reposition around reliable AI systems, build reviews, and open-source contribution |
| `/explore` | Community discovery | DevUnity product surface | Keep only under an explicit “DevUnity Platform” identity; remove from portfolio navigation |
| `/dashboard` | Community application dashboard | DevUnity product surface | Keep functional; add `noindex` unless intended as a public acquisition page |
| `/videos` | Broad learning content | Secondary knowledge surface | Reposition around architecture teardowns and agent-system demonstrations |
| `/ai-tools` | Generic AI tools directory | Dilutes specialist positioning | Remove from portfolio navigation; `noindex` or migrate into a curated engineering-resources page |
| `/backendless` | General project builder | Separate product concept | Label as an archived/reference product or move to its own deployment |
| `/resume` | Professional evidence | Supports identity | Keep; ensure claims match the generated PDF and evidence registry |
| `/privacy` | Legal/support route | Neutral | Keep |
| `/login`, `/signup` | DevUnity authentication | Product infrastructure | Keep functional; `noindex`; never feature in portfolio navigation |
| `/question`, `/question/[id]` | Community Q&A | DevUnity product surface | Keep functional; visually identify as DevUnity and separate from the personal portfolio |
| `/blogs` | Redirect | Correctly consolidated | Preserve permanent redirect to `/blog` |

## Navigation boundary

The personal portfolio should promote only: Home, Systems, Engineering Evidence, Writing, Community, Resume, Contact. DevUnity application routes should be reachable from a clearly labelled product entry point, not mixed into the professional navigation.

## Search boundary

Index: `/`, `/systems/*`, `/blog`, `/blog/*`, `/resume`, the repositioned `/about`, and the repositioned `/community`.

Consider `noindex`: dashboards, authentication, generic directories, creation tools, and empty/low-value community states.

## Follow-up implementation order

1. Rewrite `/about` and `/community`.
2. Add explicit DevUnity product branding to application routes.
3. Remove generic tools/application routes from portfolio navigation.
4. Apply route-level metadata and `noindex` decisions.
5. Re-crawl the production site and verify canonical URLs.
