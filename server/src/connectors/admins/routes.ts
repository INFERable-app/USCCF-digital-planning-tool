import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../../middleware.js';
import { normalizeEmail } from './neo4jAdminRepository.js';
import { adminRepo, bootstrapAdmins } from './isAdminEmail.js';

const router = Router();

const emailSchema = z.object({ email: z.string().email() });

router.get('/admins', requireAdmin, async (_req, res) => {
	try {
		const admins = await adminRepo.list();
		res.json({ admins, bootstrap: bootstrapAdmins() });
	} catch (err) {
		console.error('GET /api/admins error:', err);
		res.status(500).json({ error: 'Failed to load admins' });
	}
});

router.post('/admins', requireAdmin, async (req, res) => {
	const parsed = emailSchema.safeParse(req.body);
	if (!parsed.success) {
		res.status(400).json({ error: 'A valid email is required' });
		return;
	}
	try {
		const admin = await adminRepo.add(parsed.data.email, req.session.user!.email);
		res.json(admin);
	} catch (err) {
		console.error('POST /api/admins error:', err);
		res.status(500).json({ error: 'Failed to add admin' });
	}
});

router.delete('/admins/:email', requireAdmin, async (req, res) => {
	const email = normalizeEmail(req.params.email);
	if (email === normalizeEmail(req.session.user!.email)) {
		res.status(400).json({ error: 'You cannot remove yourself.' });
		return;
	}
	try {
		if (!(await adminRepo.has(email))) {
			res.status(404).json({ error: 'Admin not found' });
			return;
		}
		if ((await adminRepo.count()) <= 1) {
			res.status(400).json({ error: 'Cannot remove the last admin.' });
			return;
		}
		await adminRepo.remove(email);
		res.json({ ok: true });
	} catch (err) {
		console.error('DELETE /api/admins/:email error:', err);
		res.status(500).json({ error: 'Failed to remove admin' });
	}
});

export default router;
