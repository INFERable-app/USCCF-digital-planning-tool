# Wizard Graph Architect Logic Editor

## Overview

`index.html` is a browser-based **visual logic editor** for designing interactive wizard flows. It provides a no-code interface to create, edit, and visualize the nodes (screens) and edges (transitions) that power the planning tool wizard—all without writing code.

## What It Does

The editor allows you to:

- **Create and edit nodes** — Define wizard screens with different types (welcome, multiChoice, radioSurvey, checkboxSurvey, videoInfo, results)
- **Create and edit edges** — Define navigation paths and answer options between nodes
- **Live preview** — See your wizard flow rendered as a Mermaid diagram in real-time
- **Deploy changes** — Commit your graph updates to the main branch via GitHub Actions

## How It Works

### 1. **Data Loading**
On page load, the editor fetches `wizardGraph.json` from the GitHub repository using the GitHub Content API. This JSON file contains the complete graph structure with all nodes and edges.

### 2. **Two-Panel Interface**

#### Left Panel: Collections
- **Nodes Tab** — Lists all wizard screens with their type and layout
  - View: node ID, type (e.g., "multiChoice"), layout preference
  - Actions: Add new node, delete existing node, inspect properties
  
- **Edges Tab** — Lists all answer options and navigation paths
  - View: edge ID, label text, target node
  - Actions: Add new edge, delete existing edge, inspect properties

#### Right Panel: Visual + Editor

- **Top Half** — Mermaid diagram rendering
  - Shows live graph visualization as you make changes
  - Displays nodes and their connections
  
- **Bottom Half** — Properties Inspector
  - Click any node or edge to inspect and edit its fields
  - Node fields: layout, type, question/heading/body text, edge ordering
  - Edge fields: label, target node, optional state store key
  - Changes are applied locally only (not saved until deployed)

### 3. **Graph Data Structure**

The wizard graph is defined in `wizardGraph.json` with two collections:

```json
{
  "nodes": {
    "nodeId": { type, layout, edgeIds, question/heading/body, ... }
  },
  "edges": {
    "edgeId": { label, targetNodeId, storeKey, value, ... }
  }
}
```

All fields follow the specification in **[graph-data-spec.md](graph-data-spec.md)**, which defines:
- Available node types and their required fields
- Edge structure and optional state tracking
- Resolver logic for results screens

### 4. **GitHub Deployment Workflow**

When you click the **🚀 Deploy** button:

1. **Provide authentication** — Enter a GitHub Personal Access Token (must have `repo` and `workflow` scopes)
2. **Describe changes** — Explain what you modified in the graph
3. **Submit** — The editor triggers the GitHub Actions workflow: `update-wizard-graph.yml`

#### The Workflow (`.github/workflows/update-wizard-graph.yml`)

The workflow is automatically dispatched with your graph data and does the following:

- **Validate JSON syntax** — Ensures the graph data is valid JSON
- **Verify structure** — Confirms `nodes` and `edges` objects exist
- **Update file** — Writes the validated JSON to `wizardGraph.json`
- **Prevent accidents** — Verifies ONLY `wizardGraph.json` was modified (no other files)
- **Commit & push** — Creates an audit-trail commit on the main branch with your change description
- **Automated** — Uses `github-actions[bot]` as the committer for easy tracking

### 5. **Edit Workflow**

```
Edit locally in editor → Apply changes → Deploy → Workflow validates & commits → Main branch updated
```

Changes remain **in-memory only** until you deploy. This prevents accidental loss and gives you time to review.

## Key Features

- ✅ **No code required** — Drag, click, type to design your flow
- ✅ **Live preview** — Mermaid diagram updates as you edit
- ✅ **Spec-compliant** — All structures follow [graph-data-spec.md](graph-data-spec.md)
- ✅ **Audit trail** — Every deployment creates a commit with your description
- ✅ **Validation** — JSON syntax and structure checked before commit
- ✅ **Safe deploys** — Only `wizardGraph.json` can be modified; other files protected
- ✅ **Token persistence** — Your PAT is saved locally for faster future deployments

## Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- GitHub Personal Access Token with `repo` and `workflow` scopes
- Write access to the INFERable-app/USCCF-digital-planning-tool repository

## Getting Started

1. Open `index.html` in your browser
2. The current `wizardGraph.json` loads automatically
3. Click nodes/edges in the left panel to inspect and edit properties
4. Click **+ Add Node** or **+ Add Edge** to create new elements
5. Use the **🚀 Deploy** button when ready to save changes to main

---

**Documentation reference:** [graph-data-spec.md](graph-data-spec.md)
