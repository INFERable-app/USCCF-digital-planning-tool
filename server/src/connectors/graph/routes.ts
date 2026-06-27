import { Router } from 'express';
import { requireAuth } from '../../middleware.js';
import { stubRepository } from './stubRepository.js';
import { createNeo4jRepository } from './neo4jRepository.js';
import { config } from '../../config.js';
import type { GraphRepository } from './types.js';

const repo: GraphRepository =
  config.GRAPH_BACKEND === 'neo4j'
    ? createNeo4jRepository(config.NEO4J_URI, config.NEO4J_USER, config.NEO4J_PASSWORD)
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

export default router;
