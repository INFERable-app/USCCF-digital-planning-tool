export function normalizeLrsURL(rawURL) {
	if (!rawURL || typeof rawURL !== 'string') {
		return null;
	}

	try {
		const parsed = new URL(rawURL.trim());
		const normalizedPath = parsed.pathname.replace(/\/+/g, '/');
		const path = normalizedPath.replace(/\/+$/, '');

		if (/\/xapi$/i.test(path)) {
			parsed.pathname = `${path}/statements`;
		} else {
			parsed.pathname = path || '/';
		}

		return parsed.toString();
	} catch {
		return null;
	}
}

function firstNonEmpty(...values) {
	for (const value of values) {
		if (typeof value === 'string' && value.trim()) {
			return value.trim();
		}
	}
	return null;
}

function readEnv(key) {
	return import.meta.env?.[key];
}

function readEnvFlag(key) {
	return readEnv(key) === 'true';
}

export function resolveXapiConfig() {
	const url = normalizeLrsURL(firstNonEmpty(readEnv('VITE_LRS_URL')));
	const username = firstNonEmpty(readEnv('VITE_LRS_USERNAME'));
	const password = firstNonEmpty(readEnv('VITE_LRS_SECRET'));
	const activityBase = firstNonEmpty(readEnv('VITE_XAPI_ACTIVITY_BASE'));
	const pseudoAnon = readEnvFlag('VITE_XAPI_PSEUDOANON');

	if (!url || !username || !password) {
		return { enabled: false, activityBase: activityBase ?? null, pseudoAnon };
	}

	return { enabled: true, url, username, password, activityBase: activityBase ?? null, pseudoAnon };
}
