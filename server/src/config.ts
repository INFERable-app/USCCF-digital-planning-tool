import 'dotenv/config';
import { z } from 'zod';

// Parses a key ring "id:base64key[,id:base64key…]"; the first entry is the current key
function keyRing(name: string, isValidLength: (bytes: number) => boolean, lengthMessage: string) {
  return z
    .string({ required_error: `${name} is required` })
    .min(1, `${name} is required`)
    .transform((value, ctx) => {
      const ring = value.split(',').map((entry) => {
        const separator = entry.indexOf(':');
        const id = separator > 0 ? entry.slice(0, separator).trim() : '';
        const key = Buffer.from(separator > 0 ? entry.slice(separator + 1).trim() : '', 'base64');
        return { id, key };
      });
      const ids = new Set<string>();
      for (const { id, key } of ring) {
        if (!/^[A-Za-z0-9_-]+$/.test(id)) {
          ctx.addIssue({ code: 'custom', message: `${name}: each entry must be "id:base64key"` });
          return z.NEVER;
        }
        if (ids.has(id)) {
          ctx.addIssue({ code: 'custom', message: `${name}: duplicate key id "${id}"` });
          return z.NEVER;
        }
        if (!isValidLength(key.length)) {
          ctx.addIssue({ code: 'custom', message: `${name}: key "${id}" ${lengthMessage}` });
          return z.NEVER;
        }
        ids.add(id);
      }
      return ring;
    });
}

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url().default('http://localhost:3001/auth/callback'),
  NEO4J_URI: z.string().default('bolt://localhost:7687'),
  NEO4J_USER: z.string().default('neo4j'),
  NEO4J_PASSWORD: z.string().default(''),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  NODE_ENV: z.string().default('development'),
  ADMIN_EMAILS: z.string().default(''),
  UPLOADS_DIR: z.string().min(1),
  USER_ID_KEYS: keyRing('USER_ID_KEYS', (n) => n >= 32, 'must be at least 32 bytes'),
  ADMIN_INDEX_KEYS: keyRing('ADMIN_INDEX_KEYS', (n) => n >= 32, 'must be at least 32 bytes'),
  ADMIN_ENC_KEYS: keyRing('ADMIN_ENC_KEYS', (n) => n === 32, 'must be exactly 32 bytes')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
