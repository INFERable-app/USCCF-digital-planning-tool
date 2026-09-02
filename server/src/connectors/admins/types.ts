export interface AdminRecord {
	email: string;
	addedBy: string;
	addedAt: string;
}

export interface AdminRepository {
	list(): Promise<AdminRecord[]>;
	has(email: string): Promise<boolean>;
	add(email: string, addedBy: string): Promise<AdminRecord>;
	remove(email: string): Promise<void>;
	count(): Promise<number>;
}
