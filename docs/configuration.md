# Configuration

All runtime configuration belongs to the gateway. The browser bundle reads no environment
variables: the client calls same-origin paths (`/auth`, `/api`) and gets everything else from
the gateway.

## Where configuration comes from

| Source         | Used when                                  | How it is read                                                                                                            |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `server/.env`  | Running the gateway or its scripts locally | `dotenv` loads `.env` from the working directory, which is `server/` when you run via `pnpm --filter @usccf/api-gateway`. |
| Root `.env`    | `docker compose`                           | Compose substitutes `${VAR}` placeholders in `compose.yaml`, which passes them to the containers.                         |
| `compose.yaml` | `docker compose`                           | Some values are fixed there rather than taken from `.env` (see below).                                                    |

`server/src/config.ts` validates `process.env` with zod at startup. **If any variable is
missing or invalid, the process prints the errors and exits.** Templates:
`server/.env.example` (local gateway) and `.env.example` (compose).

> The seed and migration scripts import the same config. They need a complete, valid
> `server/.env` (including the Google and session values) even though they only talk to
> Neo4j.

## Gateway environment variables

"Default" is the value the code falls back to when the variable is unset.

| Variable               | Required | Default                               | What it does                                                                                                                                                                                                                                                                |
| ---------------------- | -------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                 |          | `3001`                                | Port the gateway listens on. The Vite proxy and `compose.yaml` both assume 3001.                                                                                                                                                                                            |
| `SESSION_SECRET`       | ✓        | none                                  | Signs the session cookie. At least 32 characters. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Changing it signs everyone out.                                                                                                 |
| `GOOGLE_CLIENT_ID`     | ✓        | none                                  | OAuth client id.                                                                                                                                                                                                                                                            |
| `GOOGLE_CLIENT_SECRET` | ✓        | none                                  | OAuth client secret. Server-side only; never give it a `VITE_` prefix.                                                                                                                                                                                                      |
| `GOOGLE_REDIRECT_URI`  |          | `http://localhost:3001/auth/callback` | Where Google sends the user back. It must exactly match an authorized redirect URI on the Google client. **Its origin is also where users land after sign-in**, so set it to the public site origin + `/auth/callback`; locally, use `http://localhost:5173/auth/callback`. |
| `NEO4J_URI`            |          | `bolt://localhost:7687`               | Neo4j Bolt URL. Compose fixes it to `bolt://neo4j:7687`.                                                                                                                                                                                                                    |
| `NEO4J_USER`           |          | `neo4j`                               | Neo4j user. In compose, also used to initialise the database (`NEO4J_AUTH`).                                                                                                                                                                                                |
| `NEO4J_PASSWORD`       |          | empty                                 | Neo4j password. Same note as `NEO4J_USER`. Effectively required.                                                                                                                                                                                                            |
| `GRAPH_BACKEND`        |          | `neo4j`                               | `neo4j`, or `stub` to serve `docs/wizardGraph.json` from memory. `server/.env.example` sets `stub`; change it to `neo4j` for real work. Progress and admins always use Neo4j.                                                                                               |
| `WEB_ORIGIN`           |          | `http://localhost:5173`               | The single origin allowed by CORS (with credentials). The site's public origin in production.                                                                                                                                                                               |
| `NODE_ENV`             |          | `development`                         | `production` marks the session cookie `secure` (HTTPS only). Compose sets `production`.                                                                                                                                                                                     |
| `ADMIN_EMAILS`         |          | empty                                 | Comma-separated emails that are always admins (case-insensitive). Meant as a break-glass list; day-to-day admins are managed in the graph editor and stored in Neo4j.                                                                                                       |
| `UPLOADS_DIR`          | ✓        | none                                  | Directory for uploaded PDFs, created at startup if missing. Relative paths resolve against the working directory. Compose sets `./uploads`, which is the mounted `uploads_data` volume at `/app/server/uploads`.                                                            |

### Build-time variable (unused)

`VITE_GOOGLE_CLIENT_ID` is still passed as a Docker build arg (`Dockerfile`, `compose.yaml`,
`.env.example`), but nothing in `src/` reads it any more. It is left over from client-side
Google sign-in, and leaving it empty is fine.

## Values fixed in code

These have no environment variable; change them in the file listed.

| Setting                    | Value                                                                             | Where                                                                   |
| -------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dev proxy to gateway       | `/auth`, `/api`, `^/admin$` → `http://localhost:3001`                             | `vite.config.js`                                                        |
| Dev hostnames Vite accepts | `allowedHosts` list                                                               | `vite.config.js`                                                        |
| Session lifetime           | 7 days                                                                            | `server/src/app.ts`                                                     |
| Session cookie             | `connect.sid`, httpOnly, `sameSite: lax`                                          | `server/src/app.ts`                                                     |
| Session store              | in-memory                                                                         | `server/src/app.ts`                                                     |
| OIDC issuer and scopes     | `https://accounts.google.com`, `openid email profile`                             | `server/src/connectors/oidc/`                                           |
| Upload limits              | PDF only (`application/pdf`), 25 MB                                               | `server/src/connectors/resources/routes.ts`                             |
| Start screen id            | `welcome`                                                                         | `neo4jRepository.ts`, `stubRepository.ts`, `connectors/graph/routes.ts` |
| Published ports            | app `8080`; gateway `127.0.0.1:3001`; Neo4j `127.0.0.1:7687` and `127.0.0.1:7474` | `compose.yaml`                                                          |
| Neo4j memory               | 32 MB page cache, 96 MB heap                                                      | `compose.yaml`                                                          |

## Google OAuth client

Create an OAuth 2.0 Client ID of type **Web application** in Google Cloud Console (APIs &
Services → Credentials). The gateway runs the redirect flow server-side, so what matters is
the redirect URI list:

- **Authorized redirect URIs**: one entry per environment, each exactly equal to that
  environment's `GOOGLE_REDIRECT_URI`, e.g. `http://localhost:5173/auth/callback` for local
  development and `https://<your-domain>/auth/callback` for a deployed site.
- **Authorized JavaScript origins** are not needed for the current server-side flow.

Put the client id and secret in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
