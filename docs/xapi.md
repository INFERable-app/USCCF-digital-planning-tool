# xAPI / LRS Integration

This app can send [xAPI](https://github.com/adlnet/xAPI-Spec) statements to a Learning Record Store (LRS). The foundation is in `src/xapi/`; wizard buttons and graph navigation are **not** instrumented yet.

## Configuration

Copy `.env.example` and set:

| Variable                  | Purpose                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `VITE_LRS_URL`            | LRS statements endpoint (e.g. `https://lrs.example.com/xapi/statements`)  |
| `VITE_LRS_USERNAME`       | Basic auth username                                                       |
| `VITE_LRS_SECRET`         | Basic auth password                                                       |
| `VITE_XAPI_ACTIVITY_BASE` | Base IRI for activity IDs (e.g. `https://your-domain.example/activities`) |

If any of `VITE_LRS_URL`, `VITE_LRS_USERNAME`, or `VITE_LRS_SECRET` is missing, xAPI is disabled and the app runs normally.

**Security:** Phase 1 embeds LRS credentials in the client bundle. Use sandbox keys only. See [Phase 2 migration](#phase-2-server-proxy) before production.

URLs ending in `/xapi` are automatically normalized to `/xapi/statements`.

## Module overview

| File                           | Role                                       |
| ------------------------------ | ------------------------------------------ |
| `src/xapi/client.js`           | HTTP transport (`XapiClient`)              |
| `src/xapi/statements.js`       | Statement builders                         |
| `src/xapi/actors.js`           | Actor from Google OAuth user               |
| `src/xapi/activityIds.js`      | Stable activity IRIs for graph nodes/edges |
| `src/xapi/config.js`           | Env resolution and URL normalization       |
| `src/contexts/XapiContext.jsx` | React `sendStatement()` + `isEnabled`      |

## Activity IRI convention

Base: `VITE_XAPI_ACTIVITY_BASE` (fallback: `{origin}/activities`)

| Helper                 | IRI pattern                    | Example                        |
| ---------------------- | ------------------------------ | ------------------------------ |
| `activityIds.node(id)` | `{base}/wizard/nodes/{nodeId}` | `.../wizard/nodes/challenge`   |
| `activityIds.edge(id)` | `{base}/wizard/edges/{edgeId}` | `.../wizard/edges/pick-ced-01` |
| `activityIds.wizard()` | `{base}/wizard`                | Session-level events           |

IDs match [`docs/wizardGraph.json`](wizardGraph.json).

## Verb conventions

| Interaction             | Verb                       | Object                 |
| ----------------------- | -------------------------- | ---------------------- |
| Choice / survey button  | `answered`                 | Current **node**       |
| CTA / navigation button | `interacted`               | **Edge** activity      |
| Screen viewed           | `experienced`              | **Node** activity      |
| Wizard finished         | `completed`                | `activityIds.wizard()` |
| Sign in / sign out      | `logged-in` / `logged-out` | `activityIds.wizard()` |
| Restart                 | `terminated`               | `activityIds.wizard()` |

Choice buttons use `answered` with `result.response` set to the edge `value` (or `id`). There is no `result.success` — this is a planning tool, not an assessment.

Example (future wiring in `advance()`):

```javascript
sendStatement(
	buildAnsweredStatement({
		actor: buildActorFromUser(user),
		activityId: activityIds.node('challenge'),
		response: 'ced-01'
	})
);
```

## Using xAPI in components

```javascript
import { useXapi } from '../contexts/XapiContext.jsx';
import { buildAnsweredStatement, buildActorFromUser, activityIds } from '../xapi/index.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const { sendStatement, isEnabled } = useXapi();
const { user } = useAuth();

if (isEnabled && user) {
	sendStatement(
		buildAnsweredStatement({
			actor: buildActorFromUser(user),
			activityId: activityIds.node('challenge'),
			response: 'ced-01'
		})
	);
}
```

## Dev smoke test

With LRS env vars set and a signed-in user, open the browser console in dev mode:

```javascript
await window.__xapiSendTest();
```

Sends an `experienced` statement for the `welcome` node.

## Future hook points

| Event                  | Location                           | Verb                       |
| ---------------------- | ---------------------------------- | -------------------------- |
| Sign in / sign out     | `AuthContext.jsx`                  | `logged-in` / `logged-out` |
| Choice / survey button | `advance()` in `useGraphEngine.js` | `answered`                 |
| CTA button             | `advance()`                        | `interacted`               |
| Node render            | `NodeRenderer.jsx`                 | `experienced`              |
| Results shown          | `ResultsNode`                      | `completed`                |
| Restart                | `restart()`                        | `terminated`               |

## Phase 2: server proxy

When ready for production:

1. Add `server/` with Express and `POST /api/xapi/statements` forwarding to the LRS (reuse `XapiClient` server-side).
2. Server env: `LRS_URL`, `LRS_USERNAME`, `LRS_SECRET` (no `VITE_` prefix).
3. Vite dev proxy: `/api` → `http://localhost:3001`.
4. nginx: `location /api/ { proxy_pass http://api:3001; }` in Docker compose.
5. Change client config endpoint to `/api/xapi/statements` and remove `VITE_LRS_USERNAME` / `VITE_LRS_SECRET` from the client.

Statement builders and call sites stay unchanged; only the transport layer in `config.js` changes.

## Tests

```bash
pnpm test:xapi
```

Covers URL normalization, actor building, statement shape, and activity ID helpers.
