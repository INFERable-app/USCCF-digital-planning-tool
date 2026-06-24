/**
 * Build an xAPI Agent with exactly one IFI (mbox).
 * xAPI forbids combining multiple inverse functional identifiers on one actor.
 */
export function buildActorFromUser(user) {
	if (!user?.email) {
		throw new Error('user email is required to build xAPI actor');
	}

	const actor = { mbox: `mailto:${user.email}` };
	if (user.name) actor.name = user.name;
	return actor;
}
