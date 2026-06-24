import { buildExperiencedStatement } from './statements.js';
import { buildActorFromUser } from './actors.js';
import { activityIds } from './activityIds.js';

/**
 * Dev helper — send a test "experienced" statement for the welcome node.
 * Callable from the browser console when xAPI is enabled:
 *   await window.__xapiSendTest()
 */
export async function sendTestStatement({ client, user }) {
	if (!client) {
		throw new Error('xAPI client is not configured');
	}
	if (!user) {
		throw new Error('user must be signed in to send a test statement');
	}

	const statement = buildExperiencedStatement({
		actor: buildActorFromUser(user),
		activityId: activityIds.node('welcome')
	});

	return client.sendStatement(statement);
}
