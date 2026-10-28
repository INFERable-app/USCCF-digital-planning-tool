export interface AdminRecord {
  id: string;
  email: string | null;
  addedBy: string;
  addedAt: string;
  unreadable?: boolean;
}

export interface AdminRepository {
  list(): Promise<AdminRecord[]>;
  has(email: string): Promise<boolean>;
  hasIndex(index: string): Promise<boolean>;
  add(email: string, addedBy: string): Promise<AdminRecord>;
  remove(email: string): Promise<void>;
  removeByIndex(index: string): Promise<void>;
  count(): Promise<number>;
}
