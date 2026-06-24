import { resolveXapiConfig } from './config.js';

function getActivityBase() {
	const configured = resolveXapiConfig().activityBase;
	if (configured) return configured.replace(/\/+$/, '');

	if (typeof window !== 'undefined' && window.location?.origin) {
		return `${window.location.origin}/activities`;
	}

	return 'https://localhost/activities';
}

export function createActivityIds(base = getActivityBase()) {
	const normalizedBase = base.replace(/\/+$/, '');

	return {
		node: (nodeId) => `${normalizedBase}/wizard/nodes/${nodeId}`,
		edge: (edgeId) => `${normalizedBase}/wizard/edges/${edgeId}`,
		wizard: () => `${normalizedBase}/wizard`
	};
}

export const activityIds = createActivityIds();
