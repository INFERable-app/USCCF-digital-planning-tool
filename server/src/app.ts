import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { config } from './config.js';
import healthRouter from './routes/health.js';
import oidcRouter from './connectors/oidc/routes.js';
import graphRouter from './connectors/graph/routes.js';
import progressRouter from './connectors/progress/routes.js';

const app = express();

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

export default app;
