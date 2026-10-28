import { getDriver } from '../connectors/neo4j/driver.js';
import { normalizeEmail } from '../connectors/admins/neo4jAdminRepository.js';
import { config } from '../config.js';
import { decrypt, encrypt, encryptionKeyId, hmacCurrent } from '../crypto/identity.js';

const USER_BATCH_SIZE = 500;

// Replaces every raw :User sub with its hash under the current USER_ID_KEYS key
async function migrateUsers(): Promise<number> {
  const session = getDriver().session();
  try {
    const result = await session.run(
      'MATCH (u:User) WHERE u.sub IS NOT NULL RETURN elementId(u) AS nodeId, u.sub AS sub'
    );
    const rows = result.records.map((record) => {
      const { keyId, hash } = hmacCurrent(config.USER_ID_KEYS, record.get('sub') as string);
      return { nodeId: record.get('nodeId') as string, idHash: hash, keyId };
    });
    for (let i = 0; i < rows.length; i += USER_BATCH_SIZE) {
      await session.run(
        `UNWIND $rows AS row
         MATCH (u:User) WHERE elementId(u) = row.nodeId
         SET u.idHash = row.idHash, u.keyId = row.keyId
         REMOVE u.sub`,
        { rows: rows.slice(i, i + USER_BATCH_SIZE) }
      );
    }
    return rows.length;
  } finally {
    await session.close();
  }
}

// Writes the blind index and encrypted fields for one admin and drops any plain-text fields
async function writeAdmin(nodeId: string, email: string, addedBy: string): Promise<void> {
  const index = hmacCurrent(config.ADMIN_INDEX_KEYS, normalizeEmail(email));
  const session = getDriver().session();
  try {
    const duplicate = await session.run(
      'MATCH (a:Admin {emailIndex: $emailIndex}) WHERE elementId(a) <> $nodeId RETURN count(a) AS n',
      { emailIndex: index.hash, nodeId }
    );
    if (duplicate.records[0].get('n').toNumber() > 0) {
      await session.run('MATCH (a:Admin) WHERE elementId(a) = $nodeId DELETE a', { nodeId });
      return;
    }
    await session.run(
      `MATCH (a:Admin) WHERE elementId(a) = $nodeId
       SET a.emailIndex = $emailIndex, a.indexKeyId = $indexKeyId,
           a.emailEnc = $emailEnc, a.addedByEnc = $addedByEnc
       REMOVE a.email, a.addedBy`,
      {
        nodeId,
        emailIndex: index.hash,
        indexKeyId: index.keyId,
        emailEnc: encrypt(normalizeEmail(email)),
        addedByEnc: encrypt(normalizeEmail(addedBy))
      }
    );
  } finally {
    await session.close();
  }
}

// Encrypts plain-text admins and moves every admin onto the current index and encryption keys
async function migrateAdmins(): Promise<{ migrated: number; unreadable: number }> {
  const currentIndexKeyId = config.ADMIN_INDEX_KEYS[0].id;
  const currentEncKeyId = config.ADMIN_ENC_KEYS[0].id;
  const session = getDriver().session();
  let rows;
  try {
    const result = await session.run(
      `MATCH (a:Admin)
       RETURN elementId(a) AS nodeId, a.email AS email, a.addedBy AS addedBy,
              a.indexKeyId AS indexKeyId, a.emailEnc AS emailEnc, a.addedByEnc AS addedByEnc`
    );
    rows = result.records.map((record) => ({
      nodeId: record.get('nodeId') as string,
      email: record.get('email') as string | null,
      addedBy: record.get('addedBy') as string | null,
      indexKeyId: record.get('indexKeyId') as string | null,
      emailEnc: record.get('emailEnc') as string | null,
      addedByEnc: record.get('addedByEnc') as string | null
    }));
  } finally {
    await session.close();
  }

  let migrated = 0;
  let unreadable = 0;
  for (const row of rows) {
    if (row.email) {
      await writeAdmin(row.nodeId, row.email, row.addedBy ?? '');
      migrated++;
      continue;
    }
    if (!row.emailEnc) continue;
    const isCurrent =
      row.indexKeyId === currentIndexKeyId &&
      encryptionKeyId(row.emailEnc) === currentEncKeyId &&
      (!row.addedByEnc || encryptionKeyId(row.addedByEnc) === currentEncKeyId);
    if (isCurrent) continue;
    let email;
    let addedBy;
    try {
      email = decrypt(row.emailEnc);
      addedBy = row.addedByEnc ? decrypt(row.addedByEnc) : '';
    } catch {
      unreadable++;
      continue;
    }
    await writeAdmin(row.nodeId, email, addedBy);
    migrated++;
  }
  return { migrated, unreadable };
}

// Runs before the backend accepts requests; safe to run on every boot
export async function migrateIdentities(): Promise<void> {
  const users = await migrateUsers();
  const admins = await migrateAdmins();
  if (users > 0) console.log(`Identity migration: hashed ${users} user id(s).`);
  if (admins.migrated > 0) console.log(`Identity migration: re-keyed ${admins.migrated} admin(s).`);
  if (admins.unreadable > 0) {
    console.warn(
      `Identity migration: ${admins.unreadable} admin record(s) could not be decrypted and were left unchanged.`
    );
  }
}
