import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { config } from './config.js';
import healthRouter from './routes/health.js';
import oidcRouter from './connectors/oidc/routes.js';
import graphRouter from './connectors/graph/routes.js';
import progressRouter from './connectors/progress/routes.js';
import resourcesRouter from './connectors/resources/routes.js';
import adminsRouter from './connectors/admins/routes.js';
import { isAdminEmail } from './connectors/admins/isAdminEmail.js';

const app = express();

// Behind Apache/nginx in production — needed so req.secure reflects X-Forwarded-Proto,
// otherwise express-session silently drops secure cookies.
app.set('trust proxy', 1);

app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }));
app.use(express.json());
app.use(
	session({
		secret: config.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		// In-memory store — not suitable for production. Replace with Redis before deploying.
		cookie: {
			httpOnly: true,
			sameSite: 'lax',
			secure: config.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000
		}
	})
);

app.use('/healthz', healthRouter);
app.use('/auth', oidcRouter);
app.use('/api', graphRouter);
app.use('/api', progressRouter);
app.use('/api', resourcesRouter);
app.use('/api', adminsRouter);

app.get('/admin', async (req, res) => {
	if (!req.session.user) {
		req.session.returnTo = '/admin';
		res.redirect('/auth/login');
		return;
	}
	try {
		if (!(await isAdminEmail(req.session.user.email))) {
			res.status(403).send('<h1>403 Forbidden</h1><p>You do not have admin access.</p>');
			return;
		}
	} catch (err) {
		console.error('GET /admin error:', err);
		res.status(500).send('<h1>500</h1><p>Could not verify admin access.</p>');
		return;
	}
	res.redirect('/admin.html');
});

export default app;
