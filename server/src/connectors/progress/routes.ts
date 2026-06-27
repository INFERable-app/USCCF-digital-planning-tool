import { Router } from 'express';
import { requireAuth } from '../../middleware.js';
import { createProgressRepository } from './neo4jProgressRepository.js';

const router = Router();
const repo = createProgressRepository();

router.get('/progress', requireAuth, async (req, res) => {
  try {
    const progress = await repo.getProgress(req.session.user!.sub);
    res.json(progress);
  } catch (err) {
    console.error('GET /api/progress error:', err);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

router.put('/progress', requireAuth, async (req, res) => {
  const { currentNodeId, answers, history } = req.body;
  if (!currentNodeId || typeof answers !== 'object' || !Array.isArray(history)) {
    res.status(400).json({ error: 'Invalid progress body' });
    return;
  }
  try {
    await repo.saveProgress(req.session.user!.sub, { currentNodeId, answers, history });
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/progress error:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

router.delete('/progress', requireAuth, async (req, res) => {
  try {
    await repo.clearProgress(req.session.user!.sub);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/progress error:', err);
    res.status(500).json({ error: 'Failed to clear progress' });
  }
});

export default router;
