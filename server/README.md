# @usccf/api-gateway

The Express and TypeScript gateway for the USCCF Digital Transformation Planning Tool. The
React client talks only to this gateway.

The gateway does five jobs:

- Runs Google sign-in on the server, using OIDC with PKCE, and issues a session cookie.
- Serves and edits the wizard graph in Neo4j.
- Stores each user's progress.
- Manages the admin list.
- Accepts PDF uploads.

## Quick start

Start Neo4j first. See the [root README](../README.md#local-setup). Then, from the repository
root:

1. Copy the env template:

   ```sh
   cp server/.env.example server/.env
   ```

2. Fill in `server/.env`. See [docs/configuration.md](../docs/configuration.md).

3. Start the gateway:

   ```sh
   pnpm dev:server
   ```

   It runs on `http://localhost:3001` and restarts on file changes.

## Scripts

Run these with `pnpm --filter @usccf/api-gateway <script>` from the root, or `pnpm <script>`
from inside `server/`.

| Script                              | Does                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| `dev`                               | Runs `src/server.ts` with `tsx watch`.                 |
| `build`                             | Compiles to `dist/` with `tsc`.                        |
| `start`                             | Runs the compiled `dist/server.js`.                    |
| `seed:graph`                        | Loads `docs/wizardGraph.json` into an **empty** Neo4j. |
| `migrate:pdf-page-ranges`           | One-off migration. Already applied. Do not re-run.     |
| `migrate:prompt-block-to-resources` | One-off migration. Already applied. Do not re-run.     |

## Source layout

```
src/
├─ server.ts              starts the app on PORT
├─ app.ts                 middleware, router mounting, the /admin gate
├─ config.ts              validates the environment with zod; exits if invalid
├─ middleware.ts          requireAuth, requireAdmin
├─ routes/health.ts       GET /healthz
├─ connectors/
│  ├─ oidc/               /auth/login, /auth/callback, /auth/logout, /auth/me
│  ├─ graph/              /api/graph routes; Neo4j repository and in-memory stub
│  ├─ progress/           /api/progress
│  ├─ resources/          /api/resources/upload, /api/resources/files
│  ├─ admins/             /api/admins, isAdminEmail()
│  ├─ neo4j/driver.ts     shared Neo4j driver
│  └─ xapi/               placeholder for a future integration; README only
├─ seed/graphSeed.ts      seed script
├─ scripts/               one-off data migrations
└─ types/session.d.ts     express-session typings: user, pkce, returnTo
```

Each connector follows the same pattern:

- `types.ts` defines the data shapes and a repository interface.
- A Neo4j file implements that interface.
- `routes.ts` is the Express router.

## Further reading

- [Architecture](../docs/architecture.md): route table, sign-in flow, how the client uses the
  API, known gotchas.
- [Data model](../docs/data-model.md): the Neo4j schema and the graph JSON.
- [Configuration](../docs/configuration.md): every environment variable.
- [Deployment and operations](../docs/deployment.md): running the gateway in production.
