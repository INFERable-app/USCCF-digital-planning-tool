import { config } from '../../config.js';
import {
  createAdminRepository,
  currentAdminIndex,
  normalizeEmail
} from './neo4jAdminRepository.js';

export const adminRepo = createAdminRepository();

// Break-glass only: the durable admin list lives in Neo4j as (:Admin) nodes.
// ADMIN_EMAILS exists so a fresh database (or an unreachable one) still has a
// way in.
export function bootstrapAdmins(): string[] {
  return config.ADMIN_EMAILS.split(',').map(normalizeEmail).filter(Boolean);
}

// ADMIN_EMAILS hashed under the current index key, computed once at startup
const bootstrapIndexes = new Set(bootstrapAdmins().map(currentAdminIndex));

// Checks a session's adminIndex; stored admins are kept on the current index key at boot
export async function isAdminIndex(index: string): Promise<boolean> {
  if (!index) return false;
  if (bootstrapIndexes.has(index)) return true;
  try {
    return await adminRepo.hasIndex(index);
  } catch (err) {
    console.error('isAdminIndex: admin lookup failed, falling back to ADMIN_EMAILS:', err);
    return false;
  }
}
