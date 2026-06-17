// Pure function — no React dependency.
// Walks the resolvers array and returns the first one whose `when` conditions
// all match the accumulated answers. Falls back to the last resolver if none match.
//
// Condition logic:
//   AND across keys   — every key in `when` must match
//   OR  across values — the answer for that key must be in the allowed array
//
// Example:
//   when: { challenge: ['translating', 'training'], tpm: ['yes'] }
//   matches if answers.challenge is 'translating' or 'training' AND answers.tpm is 'yes'
export function resolveResult(resolvers, answers) {
	for (const resolver of resolvers) {
		const matches = Object.entries(resolver.when).every(([key, allowed]) =>
			allowed.includes(answers[key])
		);
		if (matches) return resolver;
	}
	return resolvers[resolvers.length - 1];
}
