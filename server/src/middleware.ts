import type { Request, Response, NextFunction } from 'express';
import { config } from './config.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const admins = config.ADMIN_EMAILS.split(',').map((s) => s.trim()).filter(Boolean);
  if (!admins.includes(req.session.user.email)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
}
