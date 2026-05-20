export const startNodeId = 'welcome';

export const challengeLabels = {
	translating: 'Translating employer needs into skill requirements',
	aggregating: 'Aggregating skill requirements across employer collaborative',
	training: 'Training providers use different systems and credentials'
};

// ── Edges ────────────────────────────────────────────────────────────────────
// Each edge is an answer/choice that advances the graph.
// storeKey + value: written into accumulated answers when this edge is taken.
// Checkbox option edges have no targetNodeId; they are selected by id and
// passed as a dynamicValue array to the submit edge's advance() call.
export const edges = {
	// Welcome
	'cta-start': { id: 'cta-start', label: "Let's get started!", targetNodeId: 'category' },

	// Category
	'pick-employer': { id: 'pick-employer', label: 'Employer', targetNodeId: 'role', storeKey: 'category', value: 'employer' },
	'pick-education': { id: 'pick-education', label: 'Education Providers', targetNodeId: 'role', storeKey: 'category', value: 'education' },
	'pick-intermediary': { id: 'pick-intermediary', label: 'Workforce Intermediary', targetNodeId: 'role', storeKey: 'category', value: 'intermediary' },
	'pick-board': { id: 'pick-board', label: 'Workforce Board', targetNodeId: 'role', storeKey: 'category', value: 'board' },
	'pick-state': { id: 'pick-state', label: 'State Agency', targetNodeId: 'role', storeKey: 'category', value: 'state' },

	// Role
	'pick-role-coord': { id: 'pick-role-coord', label: 'Coordinating employer demand', targetNodeId: 'challenge', storeKey: 'role', value: 'coordinating' },
	'pick-role-align': { id: 'pick-role-align', label: 'Aligning training with industry needs', targetNodeId: 'challenge', storeKey: 'role', value: 'aligning' },
	'pick-role-track': { id: 'pick-role-track', label: 'Tracking talent pipeline outcomes', targetNodeId: 'challenge', storeKey: 'role', value: 'tracking' },
	'pick-role-other': { id: 'pick-role-other', label: 'Other', targetNodeId: 'challenge', storeKey: 'role', value: 'other' },

	// Challenge — branching point
	'pick-translating': { id: 'pick-translating', label: 'Translating employer needs into skill requirements', targetNodeId: 'context-survey', storeKey: 'challenge', value: 'translating' },
	'pick-aggregating': { id: 'pick-aggregating', label: 'Aggregating skill requirements across employer collaborative', targetNodeId: 'checkbox-survey-2', storeKey: 'challenge', value: 'aggregating' },
	'pick-training': { id: 'pick-training', label: 'Training providers use different systems and credentials', targetNodeId: 'context-survey', storeKey: 'challenge', value: 'training' },

	// Context survey — all options navigate to the same target, differ by stored value
	'context-opt-few': { id: 'context-opt-few', label: 'We have identified a few employers, but we do not have much collaboration', targetNodeId: 'tpm-certification', storeKey: 'contextOption', value: 'few-employers' },
	'context-opt-no-tools': { id: 'context-opt-no-tools', label: "We have formed an employer collaborative, but we don't have many technology tools", targetNodeId: 'tpm-certification', storeKey: 'contextOption', value: 'collaborative-no-tools' },
	'context-opt-platforms': { id: 'context-opt-platforms', label: 'We have an employer collaborative that has software platforms to support gathering and sharing information', targetNodeId: 'tpm-certification', storeKey: 'contextOption', value: 'collaborative-with-platforms' },

	// TPM certification — options navigate to different targets
	'tpm-yes': { id: 'tpm-yes', label: 'Yes', targetNodeId: 'checkbox-survey', storeKey: 'tpm', value: 'yes' },
	'tpm-no': { id: 'tpm-no', label: 'No', targetNodeId: 'tpm-video', storeKey: 'tpm', value: 'no' },

	// TPM video
	'after-video': { id: 'after-video', label: 'Next', targetNodeId: 'checkbox-survey' },

	// Checkbox survey 1 options (no targetNodeId — selected ids collected, then passed via submit edge)
	'opt-frameworks': { id: 'opt-frameworks', label: 'Some of our employers use industry-defined skills frameworks' },
	'opt-job-descriptions': { id: 'opt-job-descriptions', label: 'Employers often provide job descriptions that do not include skill definitions and how skills differ for entry-level, journeyman, and supervisor' },
	'opt-no-language': { id: 'opt-no-language', label: 'No common skills language across employer partners' },

	// Checkbox survey 1 submit
	'submit-checkbox-1': { id: 'submit-checkbox-1', label: 'Submit', targetNodeId: 'results', storeKey: 'checkboxAnswers' },

	// Checkbox survey 2 options
	'opt-meetings': { id: 'opt-meetings', label: 'Collaborative meetings' },
	'opt-dashboards': { id: 'opt-dashboards', label: 'Dashboards' },
	'opt-shared-files': { id: 'opt-shared-files', label: 'Shared files' },

	// Checkbox survey 2 submit
	'submit-checkbox-2': { id: 'submit-checkbox-2', label: 'Submit', targetNodeId: 'results', storeKey: 'checkboxAnswers' }
};

// ── Nodes ────────────────────────────────────────────────────────────────────
// edgeIds: ordered list controlling render order of choices/options.
// challengeBar: whether to render the blue challenge title bar (compact screens).
// resolvers: result nodes only — condition-matched content (see resolveResult.js).
export const nodes = {
	'welcome': {
		id: 'welcome',
		type: 'welcome',
		layout: 'hero',
		challengeBar: false,
		heading: 'Welcome to the planning tool.',
		body: 'After answering a few quick questions we can get you started on your digital transformation.',
		edgeIds: ['cta-start']
	},

	'category': {
		id: 'category',
		type: 'multiChoice',
		layout: 'hero',
		challengeBar: false,
		question: 'What category best describes your organization?',
		edgeIds: ['pick-employer', 'pick-education', 'pick-intermediary', 'pick-board', 'pick-state']
	},

	'role': {
		id: 'role',
		type: 'multiChoice',
		layout: 'hero',
		challengeBar: false,
		question: 'What is your primary role?',
		edgeIds: ['pick-role-coord', 'pick-role-align', 'pick-role-track', 'pick-role-other']
	},

	'challenge': {
		id: 'challenge',
		type: 'multiChoice',
		layout: 'hero',
		challengeBar: false,
		question: 'What challenge do you want to address through digital transformation?',
		edgeIds: ['pick-translating', 'pick-aggregating', 'pick-training']
	},

	'context-survey': {
		id: 'context-survey',
		type: 'radioSurvey',
		layout: 'compact',
		challengeBar: true,
		intro: 'Helping employers understand and define high-demand skills is a key step in moving towards aligning training with industry needs.',
		question: 'What is your current context?',
		submitLabel: 'Next',
		edgeIds: ['context-opt-few', 'context-opt-no-tools', 'context-opt-platforms']
	},

	'tpm-certification': {
		id: 'tpm-certification',
		type: 'radioSurvey',
		layout: 'compact',
		challengeBar: true,
		question: 'Are you practicing TPM?',
		submitLabel: 'Next',
		edgeIds: ['tpm-yes', 'tpm-no']
	},

	'tpm-video': {
		id: 'tpm-video',
		type: 'videoInfo',
		layout: 'compact',
		challengeBar: true,
		intro: 'Before continuing, we recommend watching this video on the TPM program.',
		videoUrl: 'https://youtu.be/IzN76ccR0ZA?si=kBpfhzgGsTBBmEY8',
		videoAlt: 'TPM Program video thumbnail',
		linkLabel: 'Watch video on the TPM program:',
		linkDisplay: 'https://youtu.be/IzN76ccR0ZA',
		edgeIds: ['after-video']
	},

	'checkbox-survey': {
		id: 'checkbox-survey',
		type: 'checkboxSurvey',
		layout: 'compact',
		challengeBar: true,
		question: 'How do employers provide information? (Check all that apply)',
		submitEdgeId: 'submit-checkbox-1',
		edgeIds: ['opt-frameworks', 'opt-job-descriptions', 'opt-no-language']
	},

	'checkbox-survey-2': {
		id: 'checkbox-survey-2',
		type: 'checkboxSurvey',
		layout: 'compact',
		challengeBar: true,
		question: 'How do you share information with employers? (Check all that apply)',
		submitEdgeId: 'submit-checkbox-2',
		edgeIds: ['opt-meetings', 'opt-dashboards', 'opt-shared-files']
	},

	// Single results node serves all challenge paths — resolvers pick the right content.
	'results': {
		id: 'results',
		type: 'results',
		layout: 'compact',
		challengeBar: true,
		edgeIds: [],
		resolvers: [
			{
				when: { challenge: ['translating', 'training'] },
				recommendation: 'Watch video on the importance of communicating skill and credential requirements.',
				videoUrl: 'https://youtu.be/IzN76ccR0ZA?si=kBpfhzgGsTBBmEY8',
				videoAlt: 'Video thumbnail',
				bodyText: 'Use a template to capture competencies from employers in a standard way.',
				cta: { label: 'View Template', url: '#' },
				footer: 'Return to this tool when you are ready to explore the next step.'
			},
			{
				when: { challenge: ['aggregating'] },
				recommendation: 'Watch video on TPM Web Tools',
				videoUrl: 'https://youtu.be/IzN76ccR0ZA?si=kBpfhzgGsTBBmEY8',
				videoAlt: 'TPM Web Tools video thumbnail',
				footer: 'Return to this tool when you are ready to explore the next step.'
			}
		]
	}
};
