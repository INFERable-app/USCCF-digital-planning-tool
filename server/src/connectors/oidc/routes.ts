import { Router } from 'express';
import { generators } from 'openid-client';
import { getOidcClient } from './client.js';
import { config } from '../../config.js';

const router = Router();

router.get('/login', async (req, res) => {
  try {
    const client = await getOidcClient();
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const state = generators.state();

    req.session.pkce = { code_verifier, state };
    await new Promise<void>((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve()))
    );

    const authUrl = client.authorizationUrl({
      scope: 'openid email profile',
      redirect_uri: config.GOOGLE_REDIRECT_URI,
      code_challenge,
      code_challenge_method: 'S256',
      state,
    });
    res.redirect(authUrl);
  } catch (err) {
    console.error('/auth/login error:', err);
    res.status(500).json({ error: 'Auth initialization failed' });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const client = await getOidcClient();
    const pkce = req.session.pkce;
    if (!pkce) {
      res.status(400).json({ error: 'Missing PKCE session' });
      return;
    }

    const params = client.callbackParams(req);
    const tokenSet = await client.callback(config.GOOGLE_REDIRECT_URI, params, {
      code_verifier: pkce.code_verifier,
      state: pkce.state,
    });
    const claims = tokenSet.claims();

    delete req.session.pkce;
    req.session.user = {
      sub: claims.sub,
      email: claims.email ?? '',
      name: typeof claims.name === 'string' ? claims.name : '',
      picture: typeof claims.picture === 'string' ? claims.picture : undefined,
    };
    res.redirect(new URL(config.GOOGLE_REDIRECT_URI).origin);
  } catch (err) {
    console.error('/auth/callback error:', err);
    res.status(500).json({ error: 'Auth callback failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json(req.session.user);
});

export default router;
