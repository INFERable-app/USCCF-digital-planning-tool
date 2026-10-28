import type { KeyedHash } from '../../crypto/identity.js';

export interface UserProgress {
  currentNodeId: string;
  answers: Record<string, string>;
  history: string[];
}

export interface ProgressRepository {
  getProgress(idHash: string): Promise<UserProgress | null>;
  saveProgress(idHash: string, progress: UserProgress): Promise<void>;
  clearProgress(idHash: string): Promise<void>;
  rekeyUser(hashes: KeyedHash[], current: KeyedHash): Promise<void>;
}
