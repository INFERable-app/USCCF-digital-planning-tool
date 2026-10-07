# USCCF Digital Transformation Planning Tool

A guided, mobile-first wizard that helps employers, education providers, workforce boards and
other organizations decide on their next step in a digital transformation. Users sign in with
Google, answer a short series of questions, and land on a results screen with a recommendation
and curated resources (PDF excerpts, links, AI prompt templates). Their place in the wizard is
saved so they can come back later.

The wizard's content (every screen, button and result) lives in a Neo4j graph and is edited
by admins, either inline inside the wizard or in a visual graph editor at `/admin`. No code
change is needed to change content.

## Repository layout

| Path                | What it is                                                                          |
| ------------------- | ----------------------------------------------------------------------------------- |
| `src/`              | The wizard (React 19, Vite). Entry: `index.html` → `src/main.jsx`.                  |
| `src/admin/`        | The graph editor (React Flow). Entry: `admin.html` → `src/admin/main.jsx`.          |
| `server/`           | API gateway (Express 4 + TypeScript, pnpm workspace package `@usccf/api-gateway`).  |
| `docs/`             | Developer documentation, the graph seed file, and the legacy editor (GitHub Pages). |
| `static/`           | Files served as-is at the site root (images, `robots.txt`). Vite's `publicDir`.     |
| `scripts/`          | Neo4j backup script and its systemd unit/timer.                                     |
| `Dockerfile`        | Builds the client and serves `dist/` with nginx.                                    |
| `server/Dockerfile` | Builds and runs the gateway.                                                        |
| `compose.yaml`      | Runs `app` (nginx), `gateway` and `neo4j` together.                                 |

## Prerequisites

- Node.js 22
- pnpm 10.33.4 (`corepack enable` picks up the version pinned in `package.json`). Installing
  with npm or yarn is blocked by a `preinstall` check.
- Docker, to run Neo4j locally
- A Google OAuth 2.0 client (web application). See
  [docs/configuration.md](docs/configuration.md#google-oauth-client).

## Local setup

1. **Install dependencies** (root and `server/` in one go, since this is a pnpm workspace):

   ```sh
   pnpm install
   ```

2. **Start Neo4j.** Create a root `.env` with at least `NEO4J_USER` and `NEO4J_PASSWORD`
   (see `.env.example`), then start only the database service:

   ```sh
   docker compose up -d neo4j
   ```

   Neo4j listens on `localhost:7687` (Bolt) and `localhost:7474` (browser UI).

3. **Configure the gateway.** Copy `server/.env.example` to `server/.env` and fill it in. Use
   the same Neo4j credentials as step 2, set `GRAPH_BACKEND=neo4j`, and set
   `GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback` so the login round-trip comes back
   through the Vite dev server. Every variable is described in
   [docs/configuration.md](docs/configuration.md).

4. **Seed the graph** into an empty database:

   ```sh
   pnpm --filter @usccf/api-gateway seed:graph
   ```

   This loads `docs/wizardGraph.json`. Only do this on a fresh database (see
   [Seeding](docs/data-model.md#seeding-and-migrations)).

5. **Run both processes** in two terminals:

   ```sh
   pnpm dev:server   # Express gateway on http://localhost:3001 (tsx watch)
   pnpm dev          # Vite on http://localhost:5173, proxies /auth, /api and /admin to 3001
   ```

   Open <http://localhost:5173>.

6. **Make yourself an admin.** Add your Google email to `ADMIN_EMAILS` in `server/.env` and
   restart the gateway. You can then open edit mode from the user menu, or visit
   <http://localhost:5173/admin> for the graph editor. Use the editor's **Admins** panel to add
   other admins permanently.

## Scripts

Root (`package.json`):

| Command           | Does                                                     |
| ----------------- | -------------------------------------------------------- |
| `pnpm dev`        | Vite dev server for the wizard and the graph editor      |
| `pnpm dev:host`   | Same, listening on all interfaces (testing from a phone) |
| `pnpm dev:server` | Runs the gateway's `dev` script                          |
| `pnpm build`      | Production client build into `dist/`                     |
| `pnpm preview`    | Serves the built `dist/` locally                         |
| `pnpm lint`       | `prettier --check .` then `eslint .`                     |
| `pnpm format`     | `prettier --write .`                                     |

Gateway (`pnpm --filter @usccf/api-gateway <script>`):

| Script                              | Does                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| `dev`                               | `tsx watch src/server.ts`                                    |
| `build`                             | `tsc` into `server/dist/`                                    |
| `start`                             | `node dist/server.js`                                        |
| `seed:graph`                        | Loads `docs/wizardGraph.json` into Neo4j                     |
| `migrate:pdf-page-ranges`           | One-off data migration (already applied; kept for reference) |
| `migrate:prompt-block-to-resources` | One-off data migration (already applied; kept for reference) |

## Checks

Run `pnpm lint` before opening a PR. There is no automated test suite yet. Playwright is
configured (`playwright.config.js`) but no `*.e2e.*` tests exist, so verify changes manually
in the running app.

## Conventions

- Use pnpm only.
- When you add a new top-level route prefix to the gateway, also add it to the `server.proxy`
  map in `vite.config.js`. Otherwise the dev server won't forward it.
- The live Neo4j database is the source of truth for wizard content. `docs/wizardGraph.json`
  is only seed data and is usually out of date.

## Documentation

- [Architecture](docs/architecture.md): how the client, gateway, Neo4j and Google sign-in fit
  together, the request flows, and known gotchas.
- [Data model](docs/data-model.md): the Neo4j schema, the wizard graph JSON, node and edge
  fields, results resolvers, resources and user progress.
- [Configuration](docs/configuration.md): every environment variable and hard-coded setting.
- [Gateway README](server/README.md): a quick tour of the `server/` package.
- Deployment and operations: to be documented.
