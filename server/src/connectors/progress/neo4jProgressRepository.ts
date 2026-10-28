import { getDriver } from '../neo4j/driver.js';
import { config } from '../../config.js';
import type { KeyedHash } from '../../crypto/identity.js';
import type { ProgressRepository, UserProgress } from './types.js';

export function createProgressRepository(): ProgressRepository {
  return {
    async getProgress(idHash: string): Promise<UserProgress | null> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          'MATCH (u:User {idHash: $idHash}) RETURN u.progress AS progress',
          { idHash }
        );
        if (result.records.length === 0) return null;
        const raw = result.records[0].get('progress');
        if (!raw) return null;
        return JSON.parse(raw) as UserProgress;
      } finally {
        await session.close();
      }
    },

    async saveProgress(idHash: string, progress: UserProgress): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run(
          'MERGE (u:User {idHash: $idHash}) SET u.keyId = $keyId, u.progress = $progressJson, u.updatedAt = datetime()',
          { idHash, keyId: config.USER_ID_KEYS[0].id, progressJson: JSON.stringify(progress) }
        );
      } finally {
        await session.close();
      }
    },

    async clearProgress(idHash: string): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('MATCH (u:User {idHash: $idHash}) REMOVE u.progress, u.updatedAt', {
          idHash
        });
      } finally {
        await session.close();
      }
    },

    // Moves a user hashed under an older key onto the current key
    async rekeyUser(hashes: KeyedHash[], current: KeyedHash): Promise<void> {
      const oldHashes = hashes.filter((h) => h.keyId !== current.keyId).map((h) => h.hash);
      if (oldHashes.length === 0) return;
      const session = getDriver().session();
      try {
        await session.run(
          `MATCH (u:User) WHERE u.idHash IN $oldHashes
           AND NOT EXISTS { MATCH (:User {idHash: $current}) }
           WITH u LIMIT 1
           SET u.idHash = $current, u.keyId = $keyId`,
          { oldHashes, current: current.hash, keyId: current.keyId }
        );
      } finally {
        await session.close();
      }
    }
  };
}
