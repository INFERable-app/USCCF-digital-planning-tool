# USCCF Digital Transformation Planning Tool

A guided flow for digital transformation planning. It helps workforce intermediaries pick their next step in a digital transformation.

Users sign in with an OIDC povider and answer a short series of questions. They land on a results
screen with a recommendation and curated resources. The app saves their place so they can come back later
when they are ready for the next step.

All wizard content lives in a Neo4j graph. Admins edit it
inside the tool using Edit Mode or in a visual graph editor at `/admin`. Content updates require no changes to the code.

## Repository layout

| Path                | What it is                                                                         |
| ------------------- | ---------------------------------------------------------------------------------- |
| `src/`              | The wizard. React 19 and Vite. Entry: `index.html` → `src/main.jsx`.               |
| `src/admin/`        | The graph editor, built on React Flow. Entry: `admin.html` → `src/admin/main.jsx`. |
| `server/`           | The backend. Express 4 and TypeScript, package `@usccf/api-gateway`.               |
| `docs/`             | Developer docs and the graph seed file.                                            |
| `static/`           | Files served as-is at the site root, such as images and `robots.txt`.              |
| `scripts/`          | A Neo4j backup script and its systemd service and timer.                           |
| `Dockerfile`        | Builds the client and serves `dist/` with nginx.                                   |
| `server/Dockerfile` | Builds and runs the backend.                                                       |
| `compose.yaml`      | Runs the `app`, `gateway` and `neo4j` containers together.                         |

## Prerequisites

- Node.js 22.
- pnpm 10.33.4. Run `corepack enable` to get the version pinned in `package.json`. A
  `preinstall` check blocks npm and yarn.
- Docker, to run Neo4j locally.
- A Google OAuth 2.0 client of type web application. See
  [docs/configuration.md](docs/configuration.md#google-oauth-client).

## Local setup

1. Install dependencies.

   ```sh
   pnpm install
   ```

2. Create a root `.env` from `.env.example`. Set at least `NEO4J_USER` and `NEO4J_PASSWORD`.

3. Start Neo4j on its own:

   ```sh
   docker compose up -d neo4j
   ```

   Bolt listens on `localhost:7687`. The Neo4j Browser is at `localhost:7474`.

4. Copy `server/.env.example` to `server/.env` and fill it in:
   - Use the same Neo4j credentials as step 2.
   - Set `GRAPH_BACKEND=neo4j`.
   - Set `GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback`, so sign-in returns
     through the Vite dev server.

   [docs/configuration.md](docs/configuration.md) describes every variable.

5. Seed the empty database:

   ```sh
   pnpm --filter @usccf/api-gateway seed:graph
   ```

   This loads `docs/wizardGraph.json`. Run it only against a fresh database. See
   [Seeding](docs/data-model.md#seeding).

6. Start the backend in one terminal:

   ```sh
   pnpm dev:server
   ```

   It runs on `http://localhost:3001` and restarts on file changes.

7. Start Vite in a second terminal:

   ```sh
   pnpm dev
   ```

   It runs on `http://localhost:5173` and forwards `/auth`, `/api` and `/admin` to the backend.

8. Open <http://localhost:5173>.

9. Make yourself an admin:
   1. Add your Google email to `ADMIN_EMAILS` in `server/.env`.
   2. Restart the backend.
   3. Open **Edit Mode** from the user menu, or go to <http://localhost:5173/admin> for the
      graph editor.
   4. Add other admins permanently in the graph editor's **Admins** panel.

## Scripts

Root `package.json`:

| Command           | Does                                                              |
| ----------------- | ----------------------------------------------------------------- |
| `pnpm dev`        | Starts the Vite dev server for the wizard and the graph editor.   |
| `pnpm dev:host`   | Same, but listens on all interfaces. Use it to test from a phone. |
| `pnpm dev:server` | Runs the backend's `dev` script.                                  |
| `pnpm build`      | Builds the client for production into `dist/`.                    |
| `pnpm preview`    | Serves the built `dist/` locally.                                 |
| `pnpm lint`       | Runs `prettier --check .`, then `eslint .`.                       |
| `pnpm format`     | Runs `prettier --write .`.                                        |

Backend scripts. Run them with `pnpm --filter @usccf/api-gateway <script>`:

| Script       | Does                                      |
| ------------ | ----------------------------------------- |
| `dev`        | Runs `tsx watch src/server.ts`.           |
| `build`      | Compiles with `tsc` into `server/dist/`.  |
| `start`      | Runs `node dist/server.js`.               |
| `seed:graph` | Loads `docs/wizardGraph.json` into Neo4j. |

## Checks

Run `pnpm lint` before opening a PR.

## Conventions

- Use pnpm only.
- When you add a new top-level route prefix to the backend, also add it to the `server.proxy`
  map in `vite.config.js`. The dev server does not forward unlisted prefixes.
- The live Neo4j database is the source of truth for wizard content. `docs/wizardGraph.json`
  is seed data only and is usually out of date.

## Documentation

- [Architecture](docs/architecture.md): how the client, backend, Neo4j and Google sign-in fit
  together, the request flows, and known gotchas.
- [Data model](docs/data-model.md): the Neo4j schema, the wizard graph JSON, node and edge
  fields, results resolvers, resources and user progress.
- [Configuration](docs/configuration.md): every environment variable and hard-coded setting.
- [Deployment and operations](docs/deployment.md): server setup, deploying updates, backups,
  restores and day-to-day tasks.
- [Backend README](server/README.md): a short tour of the `server/` package.
