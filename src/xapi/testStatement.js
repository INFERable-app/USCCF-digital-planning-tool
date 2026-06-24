import { buildExperiencedStatement } from './statements.js';
import { resolveActor } from './actors.js';
import { activityIds } from './activityIds.js';

/**
 * Dev helper — send a test "experienced" statement for the welcome node.
 * Callable from the browser console when xAPI is enabled:
 *   await window.__xapiSendTest()
 */
export async function sendTestStatement({ client, user, pseudoAnon = false }) {
	if (!client) {
		throw new Error('xAPI client is not configured');
	}

	const actor = resolveActor({ user, pseudoAnon });
	if (!actor) {
		throw new Error('no actor available — sign in or enable VITE_XAPI_PSEUDOANON');
	}

	const statement = buildExperiencedStatement({
		actor,
		activityId: activityIds.node('welcome')
	});

	return client.sendStatement(statement);
}
