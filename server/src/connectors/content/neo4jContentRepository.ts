import { getDriver } from '../neo4j/driver.js';
import type { ContentKey, ContentRepository } from './types.js';

// Each collection is one :Content node holding the whole list as a JSON string.
export function createContentRepository(): ContentRepository {
  return {
    async get(key: ContentKey): Promise<unknown[] | null> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          'MATCH (c:Content {key: $key}) RETURN c.itemsJson AS itemsJson',
          { key }
        );
        if (!result.records.length) return null;
        return JSON.parse(result.records[0].get('itemsJson') as string) as unknown[];
      } finally {
        await session.close();
      }
    },

    async put(key: ContentKey, items: unknown[]): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run(
          'MERGE (c:Content {key: $key}) SET c.itemsJson = $json, c.updatedAt = datetime()',
          { key, json: JSON.stringify(items) }
        );
      } finally {
        await session.close();
      }
    }
  };
}
