# Public project evidence — 20 October 2026

## VERIFIED: clean public main clones

Cloned unauthenticated with `git -c credential.helper= clone --depth 1 --branch main https://github.com/asadullah48/<repository>.git` into temporary directories. No existing local project files were changed.

| Repository | Public main commit | Command | Exact summary | Exit |
|---|---|---|---|---|
| OrchestratorX | `1ca950a79f64032cf21dd3c0c434d4408b0cb2a1` | `python -m pytest -q` | `41 passed in 2.91s` | 0 |
| ProtoBridge | `3449d8d9f95548010d5ed1e8265d408a4fc5b1a3` | `python -m pytest -q` | `65 passed in 7.81s` | 0 |
| GuardrailAI | `69dd5d9b1a996e6f779609c9219ce2897e3b240a` | `python -m pytest -q` | `42 passed in 5.91s` | 0 |

All runs used an isolated Python 3.14.7 virtual environment and the public clones' editable packages. Installed declared extras: `guardrailai[dev]`, `orchestratorx[dev,api]`, `protobridge[dev]`. Environment included pytest 9.1.1, Pydantic 2.14.1, LangGraph 1.2.16, FastAPI 0.150.0 and httpx 0.28.1. Counts are dated observations at the pinned commits, not guarantees about future main revisions. Protocol tests exercise local subprocess/loopback peers, not customer services.

### Existing local checkouts differ

These are read-only revision/status comparisons, not new local pytest results:

| Local checkout | Local HEAD | Comparison |
|---|---|---|
| orchestratorx-review | `1ca950a79f64032cf21dd3c0c434d4408b0cb2a1` | Same commit, but README.md, README.ar.md, src/orchestratorx/agents.py and tests/test_reliability.py modified; REVIEW-NOTES.md untracked. Public clean clone passes 41 tests; do not publish the previously reported local 42 as the remote result. |
| guardrailai | `90ca521f00fa040f978562521616a68a95e0bdd0` | Clean tracked tree, different from public main `69dd5d9`. Public clone passes 42 tests. |
| protobridge | `55e818d94a876f89f2464cefd225d84fe5420aba` | Clean tracked tree, different from public main `3449d8d`. Public clone passes 65 tests. |

## VERIFIED: GuardrailAI code boundaries

Read [`guardrailai/core/audit_ledger.py` at 69dd5d9](https://github.com/asadullah48/guardrailai/blob/69dd5d9b1a996e6f779609c9219ce2897e3b240a/guardrailai/core/audit_ledger.py) before editing claims:

- Lines 10–11: “Tamper-evident, in-memory SHA-256 hash chain.” Every stored field except current_block_hash contributes to the digest.
- Line 15: `self.blocks: List[AuditBlock] = []` stores the chain in a mutable in-memory list.
- Lines 50, 55–56: each entry links to the preceding hash, computes its digest, and appends to that list.
- Lines 60–62: hashes a sorted JSON representation excluding current_block_hash.
- Lines 64–77: verify_integrity checks identity, index, previous links, and recomputed digests.
- Lines 79–82: generate_certificate formats a workflow-id/hash prefix and verification boolean; it does not digitally sign anything.

Inference from the implementation: a writer can replace the chain and recompute its hashes. The ledger is tamper-evident, not tamper-proof; independent trusted anchoring and durable storage are not established by this class.

[`financial.py`](https://github.com/asadullah48/guardrailai/blob/69dd5d9b1a996e6f779609c9219ce2897e3b240a/guardrailai/guardrails/financial.py) lines 6–7 and 15–38 use a fixed country list and amount threshold. [`healthcare.py`](https://github.com/asadullah48/guardrailai/blob/69dd5d9b1a996e6f779609c9219ce2897e3b240a/guardrailai/guardrails/healthcare.py) lines 13–26 check an SSN-shaped regex. The workflow calls these pre-flight checks before processing. These are OFAC/AML/HIPAA Safe Harbor pattern demonstrations on synthetic fixtures, not comprehensive sanctions screening, de-identification, or regulatory certification.

## Production browser check

Visited https://asadullahshafique-devunity.vercel.app/ and https://asadullahshafique-devunity.vercel.app/ar in Chrome, then selected Projects in the navbar.

- EN: Agent Failure Atlas and Agent Rehearsal both render under Engineering projects.
- AR: Agent Failure Atlas renders; Agent Rehearsal was absent from the rendered headings and from PROJECTS_AR. Added only the missing Arabic card, matching the English release description and its synthetic/offline limits. Did not remeasure or change either project's test count in this task.
- This production check establishes the pre-change live state. The Arabic repair remains a PR change until merged and deployed.

## CHANGED

- GuardrailAI EN/AR cards, engineering evidence, module diagram, knowledge data, and /systems/guardrailai copy now describe deterministic pre-model patterns, synthetic data, and the in-memory tamper-evident ledger.
- ProtoBridge count 62 → 65; GuardrailAI 17 → 42. OrchestratorX remains 41 based on public results.
- Added the missing Arabic Agent Rehearsal card.

## ALREADY-DONE: outside this change

Testimonial removal, OpenAI/FDE targeting wording, repository count 520/512/8, navigation fixes, and accepted dependency-audit risk were not reopened.

## Validation before commit

- `python -m pytest -q` in each public clone: results in the table above, all exit 0.
- `npx --no-install playwright test e2e/project-evidence.spec.ts --workers=1 --reporter=line`: `2 passed (1.4m)`, exit 0. Both EN and AR cards and demo links checked.
- `npm run build`: compiled successfully in 14.6s; generated 49/49 pages; exit 0.
- `npx --no-install tsc --noEmit`: no errors; exit 0.
- `npm run lint`: `No ESLint warnings or errors`; exit 0. Existing next lint deprecation notice remains.
