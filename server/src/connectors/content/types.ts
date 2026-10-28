export type ContentKey = 'resources' | 'faq' | 'glossary';

export interface ContentRepository {
  get(key: ContentKey): Promise<unknown[] | null>;
  put(key: ContentKey, items: unknown[]): Promise<void>;
}
