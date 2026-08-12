import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import express, { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireAdmin } from '../../middleware.js';
import { config } from '../../config.js';

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

fs.mkdirSync(config.UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, config.UPLOADS_DIR),
	filename: (_req, _file, cb) => cb(null, `${randomUUID()}.pdf`)
});

const upload = multer({
	storage,
	limits: { fileSize: MAX_UPLOAD_BYTES },
	fileFilter: (_req, file, cb) => {
		cb(null, file.mimetype === 'application/pdf');
	}
});

const router = Router();

router.post('/resources/upload', requireAdmin, (req, res) => {
	upload.single('file')(req, res, (err) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		if (!req.file) {
			res.status(400).json({ error: 'A PDF file is required' });
			return;
		}
		res.json({ url: `/api/resources/files/${req.file.filename}` });
	});
});

router.use('/resources/files', requireAuth, express.static(config.UPLOADS_DIR));

export default router;
