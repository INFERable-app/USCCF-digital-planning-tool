import { Router } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    connectors: {
      oidc: config.GOOGLE_CLIENT_ID ? 'configured' : 'missing',
      graph: 'neo4j'
    }
  });
});

export default router;
