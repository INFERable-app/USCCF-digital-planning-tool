import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../../middleware.js';
import { stubRepository } from './stubRepository.js';
import { createNeo4jRepository } from './neo4jRepository.js';
import { config } from '../../config.js';
import type { GraphRepository, WizardGraph, GraphNode, GraphEdge } from './types.js';

const repo: GraphRepository =
  config.GRAPH_BACKEND === 'neo4j'
    ? createNeo4jRepository()
    : stubRepository;

const router = Router();

router.get('/graph', requireAuth, async (_req, res) => {
  try {
    const graph = await repo.getWizardGraph();
    res.json(graph);
  } catch (err) {
    console.error('GET /api/graph error:', err);
    res.status(500).json({ error: 'Failed to load graph' });
  }
});

router.get('/graph/nodes/:id', requireAuth, async (req, res) => {
  try {
    const node = await repo.getNode(req.params.id);
    if (!node) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }
    res.json(node);
  } catch (err) {
    console.error('GET /api/graph/nodes/:id error:', err);
    res.status(500).json({ error: 'Failed to load node' });
  }
});

// Whole-graph replace, used by the React Flow graph editor. It rewrites every
// node and edge, so it will overwrite anything saved concurrently through the
// granular routes below.
router.put('/graph', requireAdmin, async (req, res) => {
  const body = req.body as WizardGraph;
  if (!body || typeof body.nodes !== 'object' || typeof body.edges !== 'object') {
    res.status(400).json({ error: 'Invalid graph: nodes and edges are required' });
    return;
  }
  try {
    await repo.replaceGraph(body);
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/graph error:', err);
    res.status(500).json({ error: 'Failed to save graph' });
  }
});

const nodeSchema = z
  .object({
    id: z.string().min(1),
    type: z.string().min(1),
    layout: z.enum(['hero', 'compact']),
    challengeBar: z.boolean(),
    edgeIds: z.array(z.string()),
  })
  .passthrough();

const edgeSchema = z
  .object({
    id: z.string().min(1),
    label: z.string(),
    targetNodeId: z.string().min(1),
  })
  .passthrough();

const createEdgeSchema = z.object({ sourceId: z.string().min(1), edge: edgeSchema });

// The start node id is fixed server-side (see neo4jRepository.getWizardGraph),
// so deleting it would leave the wizard with no entry point.
const START_NODE_ID = 'welcome';

router.post('/graph/nodes', requireAdmin, async (req, res) => {
  const parsed = nodeSchema.safeParse(req.body?.node);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid node' });
    return;
  }
  try {
    if (await repo.getNode(parsed.data.id)) {
      res.status(409).json({ error: `A screen with id "${parsed.data.id}" already exists` });
      return;
    }
    await repo.createNode(parsed.data as unknown as GraphNode);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/graph/nodes error:', err);
    res.status(500).json({ error: 'Failed to create node' });
  }
});

router.patch('/graph/nodes/:id', requireAdmin, async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ error: 'Invalid node patch' });
    return;
  }
  try {
    if (!(await repo.getNode(req.params.id))) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }
    await repo.updateNode(req.params.id, req.body as Partial<GraphNode>);
    res.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/graph/nodes/:id error:', err);
    res.status(500).json({ error: 'Failed to update node' });
  }
});

router.delete('/graph/nodes/:id', requireAdmin, async (req, res) => {
  if (req.params.id === START_NODE_ID) {
    res.status(400).json({ error: 'The start screen cannot be deleted.' });
    return;
  }
  try {
    if (!(await repo.getNode(req.params.id))) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }
    await repo.deleteNode(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/graph/nodes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete node' });
  }
});

router.post('/graph/edges', requireAdmin, async (req, res) => {
  const parsed = createEdgeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid edge' });
    return;
  }
  const { sourceId, edge } = parsed.data;
  try {
    if (await repo.getEdge(edge.id)) {
      res.status(409).json({ error: `A button with id "${edge.id}" already exists` });
      return;
    }
    if (!(await repo.getNode(sourceId))) {
      res.status(400).json({ error: `Unknown source screen "${sourceId}"` });
      return;
    }
    if (!(await repo.getNode(edge.targetNodeId))) {
      res.status(400).json({ error: `Unknown destination screen "${edge.targetNodeId}"` });
      return;
    }
    await repo.createEdge(sourceId, edge as unknown as GraphEdge);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/graph/edges error:', err);
    res.status(500).json({ error: 'Failed to create edge' });
  }
});

router.patch('/graph/edges/:id', requireAdmin, async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ error: 'Invalid edge patch' });
    return;
  }
  const fields = req.body as Partial<GraphEdge>;
  try {
    if (!(await repo.getEdge(req.params.id))) {
      res.status(404).json({ error: 'Edge not found' });
      return;
    }
    if (fields.targetNodeId && !(await repo.getNode(fields.targetNodeId))) {
      res.status(400).json({ error: `Unknown destination screen "${fields.targetNodeId}"` });
      return;
    }
    await repo.updateEdge(req.params.id, fields);
    res.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/graph/edges/:id error:', err);
    res.status(500).json({ error: 'Failed to update edge' });
  }
});

router.delete('/graph/edges/:id', requireAdmin, async (req, res) => {
  try {
    if (!(await repo.getEdge(req.params.id))) {
      res.status(404).json({ error: 'Edge not found' });
      return;
    }
    await repo.deleteEdge(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/graph/edges/:id error:', err);
    res.status(500).json({ error: 'Failed to delete edge' });
  }
});

export default router;
