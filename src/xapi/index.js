export { XapiClient } from './client.js';
export {
	VERBS,
	buildExperiencedStatement,
	buildStatement,
	buildAnsweredStatement,
	buildInteractedStatement
} from './statements.js';
export {
	buildActorFromUser,
	buildIdentifiedActorFromUser,
	buildPseudonymousActor,
	resolveActor,
	getPseudonymousHomePage
} from './actors.js';
export { activityIds, createActivityIds } from './activityIds.js';
export { resolveXapiConfig, normalizeLrsURL } from './config.js';
export { sendTestStatement } from './testStatement.js';
