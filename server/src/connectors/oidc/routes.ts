import { Router } from 'express';
import { generators } from 'openid-client';
import { getOidcClient } from './client.js';
import { config } from '../../config.js';
import { isAdminIndex } from '../admins/isAdminEmail.js';
import { currentAdminIndex } from '../admins/neo4jAdminRepository.js';
import { createProgressRepository } from '../progress/neo4jProgressRepository.js';
import { hmacAll, hmacCurrent } from '../../crypto/identity.js';

const router = Router();
const progressRepo = createProgressRepository();

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
      state
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
      state: pkce.state
    });
    const claims = tokenSet.claims();

    // The raw sub is only hashed here and never stored
    const userHashes = hmacAll(config.USER_ID_KEYS, claims.sub);
    const currentUserHash = hmacCurrent(config.USER_ID_KEYS, claims.sub);
    await progressRepo.rekeyUser(userHashes, currentUserHash);

    const email = claims.email ?? '';
    const returnTo = req.session.returnTo ?? new URL(config.GOOGLE_REDIRECT_URI).origin;

    // New session id at login to prevent session fixation
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((err) => (err ? reject(err) : resolve()))
    );
    req.session.user = {
      idHash: currentUserHash.hash,
      adminIndex: email ? currentAdminIndex(email) : '',
      email,
      name: typeof claims.name === 'string' ? claims.name : '',
      picture: typeof claims.picture === 'string' ? claims.picture : undefined
    };
    await new Promise<void>((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve()))
    );
    res.redirect(returnTo);
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

router.get('/me', async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  try {
    const { idHash, adminIndex, name, email, picture } = req.session.user;
    const isAdmin = await isAdminIndex(adminIndex);
    res.json({ id: idHash, name, email, picture, isAdmin });
  } catch (err) {
    console.error('/auth/me error:', err);
    res.status(500).json({ error: 'Failed to resolve account' });
  }
});

export default router;
