# Dependency audit and accepted development-tooling risk

Date: 2026-10-19

## Results

Package manager: npm, using the existing `package-lock.json`.

- `npm ci` completed successfully: 474 packages added and 475 packages audited. Installed packages were synchronized to the existing lockfile; no dependency version changes were requested.
- `npm ls --all --depth=0` exited 0. Next.js and `eslint-config-next` are both 15.5.28; Tailwind CSS is 3.4.19.
- `npm audit --json` reports **7 high-severity findings**, all in development/build/lint dependencies. They trace to one root advisory in `braces`: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack-exhaustion denial of service through deeply nested patterns, affecting versions through 3.0.3.
- `npm audit --omit=dev --json` reports **0 vulnerabilities**. Production dependencies are clean according to this audit snapshot; this is not a claim that the application has no security risks.

| Package | Locked version | Relationship | Exposure |
| --- | --- | --- | --- |
| `braces` | 3.0.3 | Transitive | Development/build |
| `chokidar` | 3.6.0 | Transitive | Development/build |
| `micromatch` | 4.0.8 | Transitive | Development/build/lint |
| `fast-glob` | 3.3.1 and 3.3.3 | Transitive | Development/build/lint |
| `tailwindcss` | 3.4.19 | Direct dev dependency | Build |
| `@next/eslint-plugin-next` | 15.5.28 | Transitive | Lint |
| `eslint-config-next` | 15.5.28 | Direct dev dependency | Lint |

The seven findings are affected package entries, not seven independent root advisories. These packages are marked development-only in the lockfile. Development/build exposure remains relevant when processing untrusted patterns or source inputs.

## Approved decision

Validation after the clean install:

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0; added 474 packages, audited 475 |
| `npm ls --all --depth=0` | Exit 0; no invalid or extraneous entries reported |
| `npm run build` | Exit 0; compiled successfully and generated 49/49 static pages |
| `npx tsc --noEmit` | Exit 0; no diagnostics |
| `npm run lint` | Exit 0; no ESLint warnings or errors |
| `npm audit --json` | 7 high; 0 critical |
| `npm audit --omit=dev --json` | Exit 0; 0 vulnerabilities |

The build emitted the existing warning that edge runtime disables static generation for a page. The lint launcher emitted a `next lint` deprecation notice. Neither prevented its command from completing successfully. SHA-256 hashes of `package.json` and `package-lock.json` matched before and after installation and validation.

Accept the reported risk in development tooling for this task. Do not use `--force` fixes or forced installs. Keep `package.json` and `package-lock.json` unchanged.

- Approved: synchronize local installed packages using `npm ci`.
- Rejected: downgrade `eslint-config-next` to 14.x. npm's suggested downgrade would misalign it with Next.js 15.
- Deferred: migrate Tailwind CSS to version 4. This is a separate compatibility decision, not an automatic audit repair.
- No Next.js, React, or ESLint major-version migration is approved here.

The install also reported that `unrs-resolver@1.12.2` had its postinstall script blocked by the existing install-script policy. No script approval or policy change was made.

## Follow-up

Evaluate a Tailwind 4 migration as a separate task. Re-check the dependency graph and audit when a patched `braces` release or relevant Next ESLint update becomes available. A Tailwind migration alone may leave the ESLint dependency path affected.

For any future approved changes, run the production build, TypeScript check, lint, full audit, and production-only audit again. Review dependency and lockfile changes before committing; do not infer a clean full audit from the clean production-only result.
