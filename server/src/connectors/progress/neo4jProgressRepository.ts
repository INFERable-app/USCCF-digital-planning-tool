import { getDriver } from '../neo4j/driver.js';
import type { ProgressRepository, UserProgress } from './types.js';

export function createProgressRepository(): ProgressRepository {
  return {
    async getProgress(sub: string): Promise<UserProgress | null> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          'MATCH (u:User {sub: $sub}) RETURN u.progress AS progress',
          { sub }
        );
        if (result.records.length === 0) return null;
        const raw = result.records[0].get('progress');
        if (!raw) return null;
        return JSON.parse(raw) as UserProgress;
      } finally {
        await session.close();
      }
    },

    async saveProgress(sub: string, progress: UserProgress): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run(
          'MERGE (u:User {sub: $sub}) SET u.progress = $progressJson, u.updatedAt = datetime()',
          { sub, progressJson: JSON.stringify(progress) }
        );
      } finally {
        await session.close();
      }
    },

    async clearProgress(sub: string): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run(
          'MATCH (u:User {sub: $sub}) REMOVE u.progress, u.updatedAt',
          { sub }
        );
      } finally {
        await session.close();
      }
    },
  };
}
