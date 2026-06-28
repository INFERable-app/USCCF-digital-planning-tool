import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware.js';
import { stubRepository } from './stubRepository.js';
import { createNeo4jRepository } from './neo4jRepository.js';
import { config } from '../../config.js';
import type { GraphRepository, WizardGraph } from './types.js';

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

export default router;
