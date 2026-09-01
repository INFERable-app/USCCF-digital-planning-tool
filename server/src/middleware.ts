import type { Request, Response, NextFunction } from 'express';
import { isAdminEmail } from './connectors/admins/isAdminEmail.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.session.user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	next();
}

// Express 4 does not catch async rejections, so the body is wrapped and any
// lookup failure is handed to the error handler rather than hanging the request.
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
	if (!req.session.user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	isAdminEmail(req.session.user.email)
		.then((allowed) => {
			if (!allowed) {
				res.status(403).json({ error: 'Forbidden' });
				return;
			}
			next();
		})
		.catch(next);
}
