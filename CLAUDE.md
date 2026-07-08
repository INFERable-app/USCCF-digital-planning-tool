# USCCF Digital Planning Tool — Context & Rules

## Tech Stack

- Core: React 19, Vite 8 (client, `src/`); Express 4 + TypeScript API gateway (`server/`, package `@usccf/api-gateway`, run via `tsx`)
- Database: Neo4j (`neo4j-driver`), accessed via `server/src/connectors/graph/neo4jRepository.ts`. The live database is the source of truth for the wizard graph, served at runtime via `GET /api/graph` — the checked-in `docs/wizardGraph.json` is only used to seed Neo4j and may not reflect current state.
- Auth: Google/OIDC via `openid-client` + `express-session` on the server, `@react-oauth/google` on the client
- Styling: plain per-component CSS, no framework
- Package manager: pnpm only (`pnpm@10.33.4`, enforced via `only-allow pnpm`)

## Critical Commands

- Dev (client): `pnpm dev` / `pnpm dev:host` (Vite, proxies `/auth`, `/api`, `/admin` to the server)
- Dev (server): `pnpm dev:server` (Express gateway, `tsx watch`)
- Build: `pnpm build` (client), `pnpm --filter @usccf/api-gateway build` (server, `tsc`)
- Lint: `pnpm lint` (`prettier --check . && eslint .`), format: `pnpm format`
- Seed graph data into Neo4j: `pnpm --filter @usccf/api-gateway seed:graph`
- No root test script exists. Playwright is configured (`playwright.config.js`, `testMatch: '**/*.e2e.{ts,js}'`) but no `.e2e.*` test files exist yet — there is currently no automated test suite to run before considering a task complete; rely on `pnpm lint` plus manual verification of the running app instead.

## Anti-Regression & Surgical Style Rules

- DO NOT make sweeping code changes or refactor functional surrounding code.
- DO NOT leave comments explaining changes made relative to previous versions of the code. They are not helpful.
- Focus strictly on localized, line-by-line or block-by-block edits inside requested methods.
- Never clear out working TODOs, "clean up" comments, or alter variable names outside the requested scope.
- Maintain strict backward compatibility for all shared utilities, hooks, and public API interfaces.
- Prefer explicit, declarative code over dense abstractions. Do not introduce new abstractions for one-off tasks.
- Only write very brief comments that explain what code does, not why certain decisions were made.
- Always extract URLs and environment values from environment variables. NEVER implement default values.

## Operational Workflow

- Avoid using shell tools for reading and writing. Use your tools instead.
- When reviewing a pull request, ALL code lookups must come from `gh pr diff <number>`. NEVER read files from the local repo during a PR review — the local branch is different and will give wrong results. NEVER use `gh api` to fetch file contents either — stick to `gh` subcommands (`gh pr diff`, `gh pr view`, etc.) and grep the diff output for anything not covered by it.
- Every PR review finding MUST include a concrete suggested fix (not just a problem statement) — state the specific code change, helper, or approach that resolves it, not just "this should be fixed."
- Before reporting a PR review finding, confirm the diff itself introduces or worsens it. If the root cause already existed in code the diff doesn't touch — even if the diff moves where it surfaces — it is out of scope; do not report it.
- State each PR review finding as briefly as possible: one sentence for the problem, one sentence for the fix. Skip the walkthrough of how you traced it — the reader wants the conclusion, not the derivation.
- Every PR review finding MUST name the enclosing function alongside the file:line, so the reader can jump straight to it without searching.
- ALWAYS run `pnpm lint` before considering a task complete.
- For multi-file changes, print a structural modification blueprint and wait for approval before editing.
- If a compilation or lint error occurs, solve the immediate break before writing new features.
