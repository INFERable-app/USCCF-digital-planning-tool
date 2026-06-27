import { Issuer, type Client } from 'openid-client';
import { config } from '../../config.js';

let _client: Client | null = null;

export async function getOidcClient(): Promise<Client> {
  if (_client) return _client;
  const issuer = await Issuer.discover('https://accounts.google.com');
  _client = new issuer.Client({
    client_id: config.GOOGLE_CLIENT_ID,
    client_secret: config.GOOGLE_CLIENT_SECRET,
    redirect_uris: [config.GOOGLE_REDIRECT_URI],
    response_types: ['code'],
  });
  return _client;
}
