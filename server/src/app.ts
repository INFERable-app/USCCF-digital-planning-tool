import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import healthRouter from './routes/health.js';
import oidcRouter from './connectors/oidc/routes.js';
import graphRouter from './connectors/graph/routes.js';
import progressRouter from './connectors/progress/routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use('/healthz', healthRouter);
app.use('/auth', oidcRouter);
app.use('/api', graphRouter);
app.use('/api', progressRouter);

app.get('/admin', (req, res) => {
  if (!req.session.user) {
    req.session.returnTo = '/admin';
    res.redirect('/auth/login');
    return;
  }
  const admins = config.ADMIN_EMAILS.split(',').map((s) => s.trim()).filter(Boolean);
  if (!admins.includes(req.session.user.email)) {
    res.status(403).send('<h1>403 Forbidden</h1><p>You do not have admin access.</p>');
    return;
  }
  res.sendFile(resolve(__dirname, '../../docs/index.html'));
});

export default app;
