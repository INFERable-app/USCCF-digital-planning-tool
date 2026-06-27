# @usccf/api-gateway

Node.js + Express API gateway for the USCCF Digital Transformation Planning Tool.

## Quick start

```bash
cp .env.example .env
# fill in SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
pnpm dev
```

Runs on `http://localhost:3001` by default.

## Environment variables

See `.env.example` for the full list with descriptions.

| Variable | Required | Default |
|---|---|---|
| `PORT` | | `3001` |
| `SESSION_SECRET` | ✓ | — |
| `GOOGLE_CLIENT_ID` | ✓ | — |
| `GOOGLE_CLIENT_SECRET` | ✓ | — |
| `GOOGLE_REDIRECT_URI` | | `http://localhost:3001/auth/callback` |
| `GRAPH_BACKEND` | | `stub` |
| `NEO4J_URI` | if neo4j | `bolt://localhost:7687` |
| `NEO4J_USER` | if neo4j | `neo4j` |
| `NEO4J_PASSWORD` | if neo4j | — |
| `WEB_ORIGIN` | | `http://localhost:5173` |

## Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/healthz` | — | Connector readiness |
| `GET` | `/auth/login` | — | Start Google OIDC login (PKCE) |
| `GET` | `/auth/callback` | — | Google OAuth callback |
| `POST` | `/auth/logout` | — | Destroy session |
| `GET` | `/auth/me` | session | Current user profile |
| `GET` | `/api/graph` | session | Full wizard graph |
| `GET` | `/api/graph/nodes/:id` | session | Single node |

## Connectors

- **OIDC (`src/connectors/oidc/`)** — BFF flow: gateway holds the Google client secret and issues an httpOnly session cookie. The React app never touches tokens directly.
- **Graph (`src/connectors/graph/`)** — `GraphRepository` interface with two implementations: `stubRepository` (reads `docs/wizardGraph.json`) and `neo4jRepository` (not yet implemented). Switch with `GRAPH_BACKEND=neo4j`.
- **xAPI** — seam only; see `src/connectors/xapi/README.md`.

## Integrating the React frontend

To switch the frontend from client-side Google sign-in to the gateway BFF:

1. **Add a Vite dev proxy** in `vite.config.js`:
   ```js
   server: {
     proxy: {
       '/auth': 'http://localhost:3001',
       '/api': 'http://localhost:3001',
     }
   }
   ```

2. **Replace `SignInScreen.jsx`** — instead of `useGoogleLogin`, redirect to `/auth/login`.

3. **Replace `AuthContext.jsx`** — instead of `localStorage`, call `GET /auth/me` on load; call `POST /auth/logout` on sign-out.

4. **Remove `VITE_GOOGLE_CLIENT_SECRET`** from `.env.local` and all Vite env usage. Rotate the secret — it was exposed via the `VITE_` prefix.

## Session store

The scaffold uses Express's default in-memory store. Replace with a Redis-backed store before deploying to production.
