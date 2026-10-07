# @usccf/api-gateway

The Express + TypeScript gateway for the USCCF Digital Transformation Planning Tool. It
handles Google sign-in (server-side OIDC with PKCE and a session cookie), serves and edits the
wizard graph in Neo4j, stores per-user progress, manages the admin list, and accepts PDF
uploads. The React client only ever talks to this gateway.

## Quick start

From the repository root, with Neo4j running (see the [root README](../README.md#local-setup)):

```sh
cp server/.env.example server/.env   # then fill it in, see docs/configuration.md
pnpm dev:server                      # tsx watch, http://localhost:3001
```

## Scripts

Run these with `pnpm --filter @usccf/api-gateway <script>`, or plain `pnpm <script>` from
inside `server/`.

| Script                              | Does                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `dev`                               | Run `src/server.ts` with `tsx watch`                 |
| `build`                             | Compile to `dist/` with `tsc`                        |
| `start`                             | Run the compiled `dist/server.js`                    |
| `seed:graph`                        | Load `docs/wizardGraph.json` into an **empty** Neo4j |
| `migrate:pdf-page-ranges`           | One-off migration, already applied                   |
| `migrate:prompt-block-to-resources` | One-off migration, already applied                   |

## Source layout

```
src/
├─ server.ts              starts the app on PORT
├─ app.ts                 middleware, router mounting, the /admin gate
├─ config.ts              zod-validated environment (exits on invalid config)
├─ middleware.ts          requireAuth, requireAdmin
├─ routes/health.ts       GET /healthz
├─ connectors/
│  ├─ oidc/               /auth/login, /auth/callback, /auth/logout, /auth/me
│  ├─ graph/              /api/graph… (Neo4j repository + in-memory stub)
│  ├─ progress/           /api/progress
│  ├─ resources/          /api/resources/upload, /api/resources/files
│  ├─ admins/             /api/admins, isAdminEmail()
│  ├─ neo4j/driver.ts     shared Neo4j driver
│  └─ xapi/               placeholder for a future integration (README only)
├─ seed/graphSeed.ts      seed script
├─ scripts/               one-off data migrations
└─ types/session.d.ts     express-session typings (user, pkce, returnTo)
```

Each connector follows the same pattern: a `types.ts` with a repository interface, a Neo4j
implementation of it, and a `routes.ts` router.

## Further reading

- [Architecture](../docs/architecture.md): route table, sign-in flow, how the client uses the
  API, known gotchas
- [Data model](../docs/data-model.md): Neo4j schema and the graph JSON
- [Configuration](../docs/configuration.md): every environment variable
