# Wizard Graph Architect Logic Editor

## Overview

The **Wizard Graph Architect** is a React-based visual editor for designing interactive wizard flows. It provides a no-code, node-based interface (built on [React Flow](https://reactflow.dev/)) to create, edit, and visually arrange the nodes (screens) and edges (transitions) that power the planning tool wizard — all without writing code.

It is served at `/admin`, gated by Google/OIDC session login plus the `ADMIN_EMAILS` allowlist (see `server/src/app.ts`).

## What It Does

The editor allows you to:

- **Create and edit nodes** — Define wizard screens with different types (welcome, multiChoice, radioSurvey, checkboxSurvey, videoInfo, results)
- **Create and edit edges** — Define navigation paths and answer options between nodes, either by dragging a connection onto an existing node or dragging out to empty canvas to create a new connected node
- **Manually arrange the layout** — Drag nodes to any position; positions persist (`positionX`/`positionY` on each node). An "Auto-arrange" action re-runs a left-to-right automatic layout (via [dagre](https://github.com/dagrejs/dagre)) without forcing you to keep it
- **Live canvas** — See the full graph as a horizontally-arranged node diagram, not a linear/vertical flowchart
- **Save changes** — Explicitly publish your edits to the live database

## How It Works

### 1. **Data Loading**

On load, the editor fetches the current graph from `GET /api/graph`, which reads live from Neo4j (see `server/src/connectors/graph/neo4jRepository.ts`). This is the same endpoint the running wizard app uses — **the live database is the source of truth**, not any file in this repo.

### 2. **Three-Pane Interface**

- **Canvas (center)** — The node graph itself. Drag nodes to reposition them; drag from a node's right-edge handle to create/edit an edge; click a node or edge to select it.
- **Toolbar (top)** — Add Node menu, Auto-arrange, Fit View, dirty-state indicator, and Save.
- **Inspector (right, opens on selection)** — Edit the selected node's or edge's fields:
  - Node fields: ID, display label, layout (`compact`/`hero`), type, show-challenge-bar, and per-type fields (heading/body, question, submit label, video URL, etc.)
  - A node's outgoing edges are shown as a drag-reorderable list, replacing the old free-text `edgeIds` field
  - `results` nodes get a full resolvers editor (when-conditions, recommendation, body text, resources including the AI prompt block, footer)
  - Edge fields: ID, label, target node, optional store key/value, disabled toggle

### 3. **Add / Delete Flows**

- **Add a node** — Toolbar "+ Add Node" picks a type and drops a new, disconnected node at the viewport center with type-appropriate default field values.
- **Connect two existing nodes** — Drag from a node's source handle and drop it onto another node; the edge is created immediately with an editable label.
- **Create a new connected node** — Drag from a node's source handle and release on empty canvas; a small popover lets you pick a label and type, creating both the node and the edge at once.
- **Delete a node** — Select it and press Delete (or use the inspector's Delete button). A confirmation shows exactly how many outgoing and incoming edges will also be removed. Deleting a node **only** removes edges directly touching it — it never cascades to other, now-disconnected nodes ("islands" are left as-is).
- **Delete an edge** — Same inline confirmation pattern.

### 4. **Graph Data Structure**

The wizard graph has two collections:

```json
{
  "startNodeId": "welcome",
  "nodes": {
    "nodeId": { "type", "layout", "edgeIds", "positionX", "positionY", "question"/"heading"/"body", ... }
  },
  "edges": {
    "edgeId": { "label", "targetNodeId", "storeKey", "value", "disabled", ... }
  }
}
```

All fields follow the specification in **[graph-data-spec.md](graph-data-spec.md)**, which defines:

- Available node types and their required fields, including the `positionX`/`positionY` canvas-position fields
- Edge structure and optional state tracking
- Resolver logic for results screens

### 5. **Save Workflow**

There is no autosave. Clicking **Save** opens a confirmation modal warning that this replaces the live graph in Neo4j immediately for all users, and requires a short change description before the Save button is enabled. Confirming sends the full edited graph (`{ startNodeId, nodes, edges }`) to `PUT /api/graph`, which requires an admin session (`requireAdmin`).

```
Edit locally in the canvas → dirty indicator lights up → Save → confirm modal → PUT /api/graph → live graph updated
```

The checked-in `docs/wizardGraph.json` is only used to **seed** a fresh Neo4j instance (`pnpm --filter @usccf/api-gateway seed:graph`) — it is not read at runtime and may not reflect the current live graph.

## Legacy: GitHub Actions Deploy Workflow

An earlier version of this editor (`docs/index.html`, a standalone Mermaid-based tool) deployed changes by committing an updated `wizardGraph.json` via the `.github/workflows/update-wizard-graph.yml` GitHub Actions workflow. That workflow file still exists in the repo but is **no longer used** by this editor — saves now go directly to the live database via `PUT /api/graph`, described above. The workflow is left in place as historical/legacy rather than removed, since retiring it is outside the scope of this editor rewrite.

## Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- A Google account listed in `ADMIN_EMAILS` to access `/admin`

## Getting Started

1. Log in and visit `/admin`.
2. The current live graph loads automatically, arranged left-to-right.
3. Click a node or edge to inspect and edit its fields in the right panel.
4. Use **+ Add Node**, drag-to-connect, or drag-to-empty-canvas to build out the flow.
5. Click **Save** when ready, describe your change, and confirm to publish to the live database.

---

**Documentation reference:** [graph-data-spec.md](graph-data-spec.md)
