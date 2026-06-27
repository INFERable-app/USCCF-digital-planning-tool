# xAPI Logging Service — integration seam

This connector is owned by a separate team and is not implemented here.

When ready, the gateway should expose a route that receives learning events
from the React app, anonymizes the actor (hash `sub`/email before forwarding),
and POSTs xAPI statements to the configured LRS endpoint.

Suggested integration point:
- `POST /xapi/statements` — receives events from the client
- Anonymize actor field (hash PII before forwarding)
- Forward to `{XAPI_LRS_ENDPOINT}/statements` with LRS Basic auth

See architecture: `Digital Transformation Planning Tool.drawio`
