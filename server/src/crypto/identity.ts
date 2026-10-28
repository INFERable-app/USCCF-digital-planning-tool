import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto';
import { config } from '../config.js';

export type KeyRing = { id: string; key: Buffer }[];

export interface KeyedHash {
  keyId: string;
  hash: string;
}

function hmac(key: Buffer, value: string): string {
  return createHmac('sha256', key).update(value, 'utf8').digest('base64url');
}

// One hash per key in the ring, so lookups match records made under older keys
export function hmacAll(ring: KeyRing, value: string): KeyedHash[] {
  return ring.map(({ id, key }) => ({ keyId: id, hash: hmac(key, value) }));
}

// Hash under the current (first) key only
export function hmacCurrent(ring: KeyRing, value: string): KeyedHash {
  const { id, key } = ring[0];
  return { keyId: id, hash: hmac(key, value) };
}

// AES-256-GCM under the current ADMIN_ENC_KEYS key, as "keyId.iv.tag.ciphertext" (base64url)
export function encrypt(value: string): string {
  const { id, key } = config.ADMIN_ENC_KEYS[0];
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    id,
    iv.toString('base64url'),
    tag.toString('base64url'),
    ciphertext.toString('base64url')
  ].join('.');
}

// Throws if the key id is not in ADMIN_ENC_KEYS or the blob fails authentication
export function decrypt(blob: string): string {
  const [keyId, iv, tag, ciphertext] = blob.split('.');
  const entry = config.ADMIN_ENC_KEYS.find((k) => k.id === keyId);
  if (!entry || !iv || !tag || ciphertext === undefined) {
    throw new Error('decrypt: unknown key id or malformed value');
  }
  const decipher = createDecipheriv('aes-256-gcm', entry.key, Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64url')),
    decipher.final()
  ]).toString('utf8');
}

// Key id an encrypted value was made with
export function encryptionKeyId(blob: string): string {
  return blob.split('.')[0];
}
