# Configuration

All runtime configuration belongs to the gateway. The browser bundle reads no environment
variables. The client calls same-origin paths such as `/auth` and `/api` and gets everything
else from the gateway.

## Where configuration comes from

| Source         | Used when                                   | How it is read                                                                               |
| -------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `server/.env`  | Running the gateway or its scripts locally. | `dotenv` loads `.env` from the working directory, which is `server/` under `pnpm --filter`.  |
| Root `.env`    | Running `docker compose`.                   | Compose fills the `${VAR}` placeholders in `compose.yaml` and passes them to the containers. |
| `compose.yaml` | Running `docker compose`.                   | Some values are fixed in the file instead of read from `.env`. They are noted below.         |

Templates: `server/.env.example` for the local gateway, `.env.example` for compose.

`server/src/config.ts` validates `process.env` with zod at startup. **If any variable is
missing or invalid, the gateway prints the errors and exits.**

> The seed script loads the same config. It needs a complete, valid `server/.env`, including
> the Google and session values, even though it only talks to Neo4j.

## Gateway environment variables

"Default" is the value the code uses when the variable is unset.

| Variable               | Required | Default                               |
| ---------------------- | -------- | ------------------------------------- |
| `PORT`                 |          | `3001`                                |
| `SESSION_SECRET`       | yes      | none                                  |
| `GOOGLE_CLIENT_ID`     | yes      | none                                  |
| `GOOGLE_CLIENT_SECRET` | yes      | none                                  |
| `GOOGLE_REDIRECT_URI`  |          | `http://localhost:3001/auth/callback` |
| `NEO4J_URI`            |          | `bolt://localhost:7687`               |
| `NEO4J_USER`           |          | `neo4j`                               |
| `NEO4J_PASSWORD`       |          | empty                                 |
| `GRAPH_BACKEND`        |          | `neo4j`                               |
| `WEB_ORIGIN`           |          | `http://localhost:5173`               |
| `NODE_ENV`             |          | `development`                         |
| `ADMIN_EMAILS`         |          | empty                                 |
| `UPLOADS_DIR`          | yes      | none                                  |

### `PORT`

The port the gateway listens on. The Vite proxy and `compose.yaml` both expect 3001.

### `SESSION_SECRET`

- Signs the session cookie.
- Must be at least 32 characters.
- Changing it signs everyone out.
- Generate one with:

  ```sh
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

The OAuth client's id and secret. See [Google OAuth client](#google-oauth-client). The secret
stays on the server. Never give it a `VITE_` prefix.

### `GOOGLE_REDIRECT_URI`

- Where Google sends the user back after sign-in.
- It must exactly match an authorized redirect URI on the Google client.
- **Its origin is also where users land after sign-in.**
- In production, set it to the public site origin followed by `/auth/callback`.
- Locally, use `http://localhost:5173/auth/callback`. The default points at port 3001, where
  nothing serves the app.

### `NEO4J_URI`

The Neo4j Bolt URL. `compose.yaml` fixes it to `bolt://neo4j:7687`.

### `NEO4J_USER` and `NEO4J_PASSWORD`

- The Neo4j credentials. Treat the password as required.
- Under compose, they also initialise the database through `NEO4J_AUTH`. Changing them later
  does not change the password of an existing database.

### `GRAPH_BACKEND`

- `neo4j` reads and writes the graph in Neo4j.
- `stub` serves `docs/wizardGraph.json` from memory.
- `server/.env.example` sets `stub`. Change it to `neo4j` for real work.
- Progress and admins always use Neo4j, whatever this is set to.

### `WEB_ORIGIN`

The one origin CORS allows, with credentials. In production it is the site's public origin.

### `NODE_ENV`

`production` marks the session cookie `secure`, so it is sent only over HTTPS. `compose.yaml`
sets `production`.

### `ADMIN_EMAILS`

- Comma-separated emails that are always admins. Case does not matter.
- A break-glass list. Day-to-day admins are managed in the graph editor and stored in Neo4j.

### `UPLOADS_DIR`

- The directory for uploaded PDFs. The gateway creates it at startup if it is missing.
- Relative paths resolve against the working directory.
- `compose.yaml` sets `./uploads`. That path is the `uploads_data` volume, mounted at
  `/app/server/uploads`.

### Unused build variable: `VITE_GOOGLE_CLIENT_ID`

The `Dockerfile`, `compose.yaml` and `.env.example` still pass `VITE_GOOGLE_CLIENT_ID` as a
build argument. Nothing in `src/` reads it. It is left over from client-side Google sign-in.
Leaving it empty is fine.

## Values fixed in code

These settings have no environment variable. Change them in the listed file.

| Setting                    | Value                                                                                       | Where                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dev proxy to the gateway   | `/auth`, `/api` and `^/admin$` go to `http://localhost:3001`.                               | `vite.config.js`                                                        |
| Dev hostnames Vite accepts | The `allowedHosts` list.                                                                    | `vite.config.js`                                                        |
| Session lifetime           | 7 days.                                                                                     | `server/src/app.ts`                                                     |
| Session cookie             | `connect.sid`, httpOnly, `sameSite: lax`.                                                   | `server/src/app.ts`                                                     |
| Session store              | In memory.                                                                                  | `server/src/app.ts`                                                     |
| OIDC issuer                | `https://accounts.google.com`.                                                              | `server/src/connectors/oidc/client.ts`                                  |
| OIDC scopes                | `openid email profile`.                                                                     | `server/src/connectors/oidc/routes.ts`                                  |
| Upload limits              | `application/pdf` only, 25 MB.                                                              | `server/src/connectors/resources/routes.ts`                             |
| Start screen id            | `welcome`.                                                                                  | `neo4jRepository.ts`, `stubRepository.ts`, `connectors/graph/routes.ts` |
| Published ports            | app on `8080`; gateway on `127.0.0.1:3001`; Neo4j on `127.0.0.1:7687` and `127.0.0.1:7474`. | `compose.yaml`                                                          |
| Neo4j memory               | 32 MB page cache, 96 MB heap.                                                               | `compose.yaml`                                                          |

## Google OAuth client

1. In Google Cloud Console, open **APIs & Services → Credentials**.
2. Create an **OAuth 2.0 Client ID** of type **Web application**.
3. Under **Authorized redirect URIs**, add one entry per environment. Each must equal that
   environment's `GOOGLE_REDIRECT_URI` exactly:
   - Local: `http://localhost:5173/auth/callback`
   - Deployed: `https://<your-domain>/auth/callback`
4. Leave **Authorized JavaScript origins** empty. The gateway runs the flow on the server, so
   they are not needed.
5. Put the client id in `GOOGLE_CLIENT_ID` and the secret in `GOOGLE_CLIENT_SECRET`.
