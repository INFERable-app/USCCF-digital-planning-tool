export interface UserProgress {
  currentNodeId: string;
  answers: Record<string, string>;
  history: string[];
}

export interface ProgressRepository {
  getProgress(sub: string): Promise<UserProgress | null>;
  saveProgress(sub: string, progress: UserProgress): Promise<void>;
  clearProgress(sub: string): Promise<void>;
}
