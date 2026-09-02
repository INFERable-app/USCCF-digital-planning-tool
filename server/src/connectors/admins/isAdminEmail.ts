import { config } from '../../config.js';
import { createAdminRepository, normalizeEmail } from './neo4jAdminRepository.js';

export const adminRepo = createAdminRepository();

// Break-glass only: the durable admin list lives in Neo4j as (:Admin) nodes.
// ADMIN_EMAILS exists so a fresh database (or an unreachable one) still has a
// way in.
export function bootstrapAdmins(): string[] {
	return config.ADMIN_EMAILS.split(',').map(normalizeEmail).filter(Boolean);
}

export async function isAdminEmail(email: string): Promise<boolean> {
	const normalized = normalizeEmail(email);
	if (!normalized) return false;
	if (bootstrapAdmins().includes(normalized)) return true;
	try {
		return await adminRepo.has(normalized);
	} catch (err) {
		console.error('isAdminEmail: admin lookup failed, falling back to ADMIN_EMAILS:', err);
		return false;
	}
}
