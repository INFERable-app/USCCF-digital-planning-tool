import type { Record as Neo4jRecord } from 'neo4j-driver';
import { getDriver } from '../neo4j/driver.js';
import { config } from '../../config.js';
import { decrypt, encrypt, hmacAll, hmacCurrent } from '../../crypto/identity.js';
import type { AdminRecord, AdminRepository } from './types.js';

// Emails are stored and compared lowercase so admin lookups are case-insensitive.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Blind-index hashes of an email under every ADMIN_INDEX_KEYS key
export function adminIndexes(email: string): string[] {
  return hmacAll(config.ADMIN_INDEX_KEYS, normalizeEmail(email)).map((h) => h.hash);
}

// Blind-index hash of an email under the current ADMIN_INDEX_KEYS key
export function currentAdminIndex(email: string): string {
  return hmacCurrent(config.ADMIN_INDEX_KEYS, normalizeEmail(email)).hash;
}

const RETURN_ADMIN =
  'RETURN a.emailIndex AS id, a.emailEnc AS emailEnc, a.addedByEnc AS addedByEnc, toString(a.addedAt) AS addedAt';

// Decrypts a row for display; a row whose key is gone is flagged unreadable
function toAdminRecord(record: Neo4jRecord): AdminRecord {
  const id = record.get('id') as string;
  const addedAt = (record.get('addedAt') as string) ?? '';
  const addedByEnc = record.get('addedByEnc') as string | null;
  try {
    return {
      id,
      email: decrypt(record.get('emailEnc') as string),
      addedBy: addedByEnc ? decrypt(addedByEnc) : '',
      addedAt
    };
  } catch {
    return { id, email: null, addedBy: '', addedAt, unreadable: true };
  }
}

export function createAdminRepository(): AdminRepository {
  return {
    async list(): Promise<AdminRecord[]> {
      const session = getDriver().session();
      try {
        const result = await session.run(`MATCH (a:Admin) ${RETURN_ADMIN}`);
        return result.records
          .map(toAdminRecord)
          .sort((a, b) => (a.email ?? '￿').localeCompare(b.email ?? '￿'));
      } finally {
        await session.close();
      }
    },

    async has(email: string): Promise<boolean> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          'MATCH (a:Admin) WHERE a.emailIndex IN $hashes RETURN count(a) AS n',
          { hashes: adminIndexes(email) }
        );
        return result.records[0].get('n').toNumber() > 0;
      } finally {
        await session.close();
      }
    },

    async hasIndex(index: string): Promise<boolean> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          'MATCH (a:Admin {emailIndex: $index}) RETURN count(a) AS n',
          { index }
        );
        return result.records[0].get('n').toNumber() > 0;
      } finally {
        await session.close();
      }
    },

    async add(email: string, addedBy: string): Promise<AdminRecord> {
      const normalized = normalizeEmail(email);
      const session = getDriver().session();
      try {
        const existing = await session.run(
          `MATCH (a:Admin) WHERE a.emailIndex IN $hashes ${RETURN_ADMIN} LIMIT 1`,
          { hashes: adminIndexes(normalized) }
        );
        if (existing.records.length > 0) return toAdminRecord(existing.records[0]);

        const index = hmacCurrent(config.ADMIN_INDEX_KEYS, normalized);
        const result = await session.run(
          `CREATE (a:Admin {emailIndex: $emailIndex, indexKeyId: $indexKeyId,
             emailEnc: $emailEnc, addedByEnc: $addedByEnc, addedAt: datetime()})
           ${RETURN_ADMIN}`,
          {
            emailIndex: index.hash,
            indexKeyId: index.keyId,
            emailEnc: encrypt(normalized),
            addedByEnc: encrypt(normalizeEmail(addedBy))
          }
        );
        return toAdminRecord(result.records[0]);
      } finally {
        await session.close();
      }
    },

    async remove(email: string): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('MATCH (a:Admin) WHERE a.emailIndex IN $hashes DELETE a', {
          hashes: adminIndexes(email)
        });
      } finally {
        await session.close();
      }
    },

    async removeByIndex(index: string): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('MATCH (a:Admin {emailIndex: $index}) DELETE a', { index });
      } finally {
        await session.close();
      }
    },

    async count(): Promise<number> {
      const session = getDriver().session();
      try {
        const result = await session.run('MATCH (a:Admin) RETURN count(a) AS n');
        return result.records[0].get('n').toNumber();
      } finally {
        await session.close();
      }
    }
  };
}
