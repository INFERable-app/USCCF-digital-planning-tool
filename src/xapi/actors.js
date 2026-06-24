const PSEUDOANON_SESSION_KEY = 'xapi_pseudoanon_session';

function readEnv(key) {
	return import.meta.env?.[key];
}

export function getPseudonymousHomePage() {
	const base = readEnv('VITE_XAPI_ACTIVITY_BASE');
	if (base) {
		try {
			return `${new URL(base).origin}/pseudoanon`;
		} catch {
			// fall through
		}
	}

	if (typeof window !== 'undefined' && window.location?.origin) {
		return `${window.location.origin}/pseudoanon`;
	}

	return 'https://localhost/pseudoanon';
}

export function getOrCreatePseudonymousSessionId(storage = typeof sessionStorage !== 'undefined' ? sessionStorage : null) {
	if (!storage) {
		return crypto.randomUUID();
	}

	try {
		const existing = storage.getItem(PSEUDOANON_SESSION_KEY);
		if (existing) return existing;

		const sessionId = crypto.randomUUID();
		storage.setItem(PSEUDOANON_SESSION_KEY, sessionId);
		return sessionId;
	} catch {
		return crypto.randomUUID();
	}
}

export function buildPseudonymousActor({ homePage, sessionId, storage } = {}) {
	return {
		account: {
			homePage: homePage ?? getPseudonymousHomePage(),
			name: sessionId ?? getOrCreatePseudonymousSessionId(storage)
		}
	};
}

export function buildIdentifiedActorFromUser(user) {
	if (!user?.email) {
		throw new Error('user email is required to build identified xAPI actor');
	}

	const actor = { mbox: `mailto:${user.email}` };
	if (user.name) actor.name = user.name;
	return actor;
}

/**
 * Resolve the actor for a statement.
 * When pseudoAnon is enabled, always returns a session-scoped pseudonymous actor
 * (no mbox), even if the user is signed in.
 */
export function resolveActor({ user, pseudoAnon = false, homePage, sessionId, storage } = {}) {
	if (pseudoAnon) {
		return buildPseudonymousActor({ homePage, sessionId, storage });
	}

	if (!user) {
		return null;
	}

	return buildIdentifiedActorFromUser(user);
}

/** @deprecated Prefer resolveActor({ user, pseudoAnon }) */
export function buildActorFromUser(user) {
	return buildIdentifiedActorFromUser(user);
}
