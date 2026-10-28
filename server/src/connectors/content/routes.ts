import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin, requireAuth } from '../../middleware.js';
import { createContentRepository } from './neo4jContentRepository.js';
import type { ContentKey } from './types.js';

const router = Router();
const contentRepo = createContentRepository();

const CATEGORY_IDS = ['start', 'demand', 'skills', 'providers', 'tracking', 'templates'] as const;

const resourceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['link', 'pdf', 'reference', 'prompt']),
  label: z.string(),
  description: z.string().optional(),
  url: z.string().optional(),
  text: z.string().optional(),
  pageStart: z.number().int().positive().optional(),
  pageEnd: z.number().int().positive().optional(),
  wholeDocument: z.boolean().optional(),
  categories: z.array(z.enum(CATEGORY_IDS)).nonempty()
});

const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  intro: z.string(),
  bullets: z.array(z.string()).optional(),
  outro: z.string().optional()
});

const glossarySchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1)
});

const itemSchemas: Record<ContentKey, z.ZodTypeAny> = {
  resources: resourceSchema,
  faq: faqSchema,
  glossary: glossarySchema
};

function isContentKey(key: string): key is ContentKey {
  return Object.hasOwn(itemSchemas, key);
}

router.get('/content/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  if (!isContentKey(key)) {
    res.status(404).json({ error: 'Unknown content' });
    return;
  }
  try {
    const items = await contentRepo.get(key);
    if (!items) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }
    res.json({ items });
  } catch (err) {
    console.error('GET /api/content/:key error:', err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

router.put('/content/:key', requireAdmin, async (req, res) => {
  const { key } = req.params;
  if (!isContentKey(key)) {
    res.status(404).json({ error: 'Unknown content' });
    return;
  }
  const parsed = z.object({ items: z.array(itemSchemas[key]) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid content' });
    return;
  }
  try {
    await contentRepo.put(key, parsed.data.items);
    res.json({ items: parsed.data.items });
  } catch (err) {
    console.error('PUT /api/content/:key error:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

export default router;
