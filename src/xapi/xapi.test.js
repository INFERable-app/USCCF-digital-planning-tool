import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLrsURL } from './config.js';
import { buildActorFromUser, buildIdentifiedActorFromUser, resolveActor } from './actors.js';
import { buildAnsweredStatement } from './statements.js';
import { createActivityIds } from './activityIds.js';

describe('normalizeLrsURL', () => {
	it('appends /statements when path ends with /xapi', () => {
		assert.equal(normalizeLrsURL('http://example.com/xapi'), 'http://example.com/xapi/statements');
	});

	it('preserves URLs already pointing at /xapi/statements', () => {
		assert.equal(
			normalizeLrsURL('http://example.com/xapi/statements'),
			'http://example.com/xapi/statements'
		);
	});

	it('collapses duplicate slashes in paths', () => {
		assert.equal(
			normalizeLrsURL('http://example.com//xapi/statements'),
			'http://example.com/xapi/statements'
		);
	});

	it('returns null for invalid input', () => {
		assert.equal(normalizeLrsURL(null), null);
		assert.equal(normalizeLrsURL('not-a-url'), null);
	});
});

describe('buildIdentifiedActorFromUser', () => {
	it('uses mbox only (xAPI max-one-ifi)', () => {
		const actor = buildIdentifiedActorFromUser({
			email: 'user@example.com',
			sub: 'google-sub-123',
			name: 'Test User'
		});

		assert.equal(actor.mbox, 'mailto:user@example.com');
		assert.equal(actor.name, 'Test User');
		assert.equal('account' in actor, false);
	});

	it('requires email', () => {
		assert.throws(() => buildIdentifiedActorFromUser({ sub: 'x' }), /email is required/);
	});
});

describe('resolveActor', () => {
	it('uses pseudonymous actor for all statements when pseudoAnon is enabled', () => {
		const actor = resolveActor({
			user: { email: 'user@example.com', name: 'Test User' },
			pseudoAnon: true,
			homePage: 'https://example.com/pseudoanon',
			sessionId: 'session-abc'
		});

		assert.deepEqual(actor, {
			account: { homePage: 'https://example.com/pseudoanon', name: 'session-abc' }
		});
		assert.equal('mbox' in actor, false);
	});

	it('uses mbox when pseudoAnon is disabled and user is signed in', () => {
		const actor = resolveActor({
			user: { email: 'user@example.com', name: 'Test User' },
			pseudoAnon: false
		});

		assert.equal(actor.mbox, 'mailto:user@example.com');
	});

	it('returns null when pseudoAnon is disabled and user is absent', () => {
		assert.equal(resolveActor({ pseudoAnon: false }), null);
	});
});

describe('buildActorFromUser', () => {
	it('remains an alias for identified actors', () => {
		const actor = buildActorFromUser({ email: 'user@example.com' });
		assert.equal(actor.mbox, 'mailto:user@example.com');
	});
});

describe('buildAnsweredStatement', () => {
	it('uses activityId as object.id without success field', () => {
		const actor = { mbox: 'mailto:user@example.com' };
		const stmt = buildAnsweredStatement({
			actor,
			activityId: 'https://example.com/activities/wizard/nodes/challenge',
			response: 'ced-01'
		});

		assert.equal(stmt.verb.id, 'http://adlnet.gov/expapi/verbs/answered');
		assert.equal(stmt.object.id, 'https://example.com/activities/wizard/nodes/challenge');
		assert.equal(stmt.result.response, 'ced-01');
		assert.equal('success' in (stmt.result ?? {}), false);
	});
});

describe('createActivityIds', () => {
	it('builds stable IRIs under the configured base', () => {
		const ids = createActivityIds('https://example.com/activities');

		assert.equal(ids.node('challenge'), 'https://example.com/activities/wizard/nodes/challenge');
		assert.equal(
			ids.edge('pick-ced-01'),
			'https://example.com/activities/wizard/edges/pick-ced-01'
		);
		assert.equal(ids.wizard(), 'https://example.com/activities/wizard');
	});
});
