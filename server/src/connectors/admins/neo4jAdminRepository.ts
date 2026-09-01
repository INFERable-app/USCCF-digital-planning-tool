import { getDriver } from '../neo4j/driver.js';
import type { AdminRecord, AdminRepository } from './types.js';

// Emails are stored and compared lowercase so admin lookups are case-insensitive.
export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function createAdminRepository(): AdminRepository {
	return {
		async list(): Promise<AdminRecord[]> {
			const session = getDriver().session();
			try {
				const result = await session.run(
					'MATCH (a:Admin) RETURN a.email AS email, a.addedBy AS addedBy, toString(a.addedAt) AS addedAt ORDER BY a.email'
				);
				return result.records.map((record) => ({
					email: record.get('email') as string,
					addedBy: (record.get('addedBy') as string) ?? '',
					addedAt: (record.get('addedAt') as string) ?? ''
				}));
			} finally {
				await session.close();
			}
		},

		async has(email: string): Promise<boolean> {
			const session = getDriver().session();
			try {
				const result = await session.run('MATCH (a:Admin {email: $email}) RETURN count(a) AS n', {
					email: normalizeEmail(email)
				});
				return result.records[0].get('n').toNumber() > 0;
			} finally {
				await session.close();
			}
		},

		async add(email: string, addedBy: string): Promise<AdminRecord> {
			const session = getDriver().session();
			try {
				const result = await session.run(
					`MERGE (a:Admin {email: $email})
					 ON CREATE SET a.addedBy = $addedBy, a.addedAt = datetime()
					 RETURN a.email AS email, a.addedBy AS addedBy, toString(a.addedAt) AS addedAt`,
					{ email: normalizeEmail(email), addedBy: normalizeEmail(addedBy) }
				);
				const record = result.records[0];
				return {
					email: record.get('email') as string,
					addedBy: (record.get('addedBy') as string) ?? '',
					addedAt: (record.get('addedAt') as string) ?? ''
				};
			} finally {
				await session.close();
			}
		},

		async remove(email: string): Promise<void> {
			const session = getDriver().session();
			try {
				await session.run('MATCH (a:Admin {email: $email}) DELETE a', {
					email: normalizeEmail(email)
				});
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
