# Dependency security

## Accepted build-time risk (2026-10-18)

`npm audit` reports **7 high findings** from one unpatched root advisory:
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
(CVE-2026-93687), recursive stack exhaustion in `braces <=3.0.3`.
**No patch available** at verification time.

Affected build/lint chains include Tailwind 3 -> chokidar / micromatch ->
braces, and Next.js ESLint plugin -> fast-glob -> micromatch -> braces.
The seven audit entries include dependent packages; they are not seven
independent root advisories.

This is **build-time only** in this application. Tailwind and its plugins are
devDependencies, used by the PostCSS/Tailwind configuration rather than request
handlers or client code. `npm ls braces --omit=dev` returns an empty tree;
`npm audit --omit=dev` reports zero vulnerabilities. Build dependencies remain
installed in the build environment, so full audit findings are still reported.
Build only trusted repository input and restrict untrusted changes to isolated CI.

Revisit when a patch ships or during a Tailwind 4 migration. Do not suppress the
advisory or force a framework downgrade to make the audit appear clean.

## Remediations

- Next.js and its ESLint configuration updated to 15.5.28.
- Compatible transitive dependency fixes applied and locked.
- Selector parser overridden to the patched 7.1.6-compatible release.
- Replaced gray-matter's legacy YAML/argparse/sprintf-js chain with `yaml` and
  an article-specific frontmatter reader, covered by parser regression tests.
- Tailwind plugins classified as development dependencies.

Verification: `npm ci`, `npm audit`, `npm audit --omit=dev`, `npm ls braces`,
`npm ls braces --omit=dev`, `node --test scripts/frontmatter.test.mjs`,
and `npm run build`. Audit results are time-sensitive.
