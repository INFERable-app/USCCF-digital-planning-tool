const VERBS = {
	experienced: 'http://adlnet.gov/expapi/verbs/experienced',
	answered: 'http://adlnet.gov/expapi/verbs/answered',
	interacted: 'http://adlnet.gov/expapi/verbs/interacted',
	completed: 'http://adlnet.gov/expapi/verbs/completed',
	terminated: 'http://adlnet.gov/expapi/verbs/terminated'
};

function buildExperiencedStatement({ actor, activityId, verbDisplay = 'experienced' }) {
	if (!actor || !activityId) {
		throw new Error('actor and activityId are required');
	}
	return {
		actor,
		verb: {
			id: VERBS.experienced,
			display: { 'en-US': verbDisplay }
		},
		object: { id: activityId, objectType: 'Activity' }
	};
}

function buildStatement({ actor, verbId, verbDisplay, objectId }) {
	if (!actor || !verbId || !objectId) {
		throw new Error('actor, verbId, and objectId are required');
	}
	return {
		actor,
		verb: {
			id: verbId,
			...(verbDisplay ? { display: { 'en-US': verbDisplay } } : {})
		},
		object: { id: objectId, objectType: 'Activity' }
	};
}

function buildAnsweredStatement({ actor, activityId, response }) {
	if (!actor || !activityId) {
		throw new Error('actor and activityId are required');
	}
	return {
		actor,
		verb: {
			id: VERBS.answered,
			display: { 'en-US': 'answered' }
		},
		object: {
			id: activityId,
			objectType: 'Activity'
		},
		result: {
			response: String(response ?? '')
		}
	};
}

function buildInteractedStatement({ actor, activityId, verbDisplay = 'interacted' }) {
	if (!actor || !activityId) {
		throw new Error('actor and activityId are required');
	}
	return {
		actor,
		verb: {
			id: VERBS.interacted,
			display: { 'en-US': verbDisplay }
		},
		object: { id: activityId, objectType: 'Activity' }
	};
}

export {
	VERBS,
	buildExperiencedStatement,
	buildStatement,
	buildAnsweredStatement,
	buildInteractedStatement
};
