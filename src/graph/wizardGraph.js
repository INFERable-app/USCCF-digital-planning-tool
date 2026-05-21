export const startNodeId = 'welcome';

export const challengeLabels = {
    'ced-01': 'Establish/Expand network',
    'ced-02': 'Convene employers',
    'ced-03': 'Build consensus',
};

// ── Edges ────────────────────────────────────────────────────────────────────
export const edges = {
    // Welcome
    //'cta-start': { id: 'cta-start', label: "Let's get started!", targetNodeId: 'category' },
    'cta-start': { id: 'cta-start', label: "Let's get started!", targetNodeId: 'role', storeKey: 'category', value: 'employer' },

    // Category — only Employer active
    'pick-employer': { id: 'pick-employer', label: 'Employer', targetNodeId: 'role', storeKey: 'category', value: 'employer' },
    'pick-education': { id: 'pick-education', label: 'Education Providers', targetNodeId: 'role', storeKey: 'category', value: 'education', disabled: true },
    'pick-intermediary': { id: 'pick-intermediary', label: 'Workforce Intermediary', targetNodeId: 'role', storeKey: 'category', value: 'intermediary', disabled: true },
    'pick-board': { id: 'pick-board', label: 'Workforce Board', targetNodeId: 'role', storeKey: 'category', value: 'board', disabled: true },
    'pick-state': { id: 'pick-state', label: 'State Agency', targetNodeId: 'role', storeKey: 'category', value: 'state', disabled: true },

    // Role — only Coordinating Employer Demand active
    'pick-role-coord': { id: 'pick-role-coord', label: 'Coordinating employer demand', targetNodeId: 'challenge', storeKey: 'role', value: 'coordinating' },
    'pick-role-align': { id: 'pick-role-align', label: 'Aligning training with industry needs', targetNodeId: 'challenge', storeKey: 'role', value: 'aligning', disabled: true },
    'pick-role-track': { id: 'pick-role-track', label: 'Tracking talent pipeline outcomes', targetNodeId: 'challenge', storeKey: 'role', value: 'tracking', disabled: true },
    'pick-role-other': { id: 'pick-role-other', label: 'Other', targetNodeId: 'challenge', storeKey: 'role', value: 'other', disabled: true },

    // Challenge (Q2)
    'pick-ced-01': { id: 'pick-ced-01', label: 'Establish/Expand employer collaborative network', targetNodeId: 'context-ced-01', storeKey: 'challenge', value: 'ced-01' },
    'pick-ced-02': { id: 'pick-ced-02', label: 'Convene employers to define shared hiring needs', targetNodeId: 'context-ced-02', storeKey: 'challenge', value: 'ced-02' },
    'pick-ced-03': { id: 'pick-ced-03', label: 'Build consensus on common job titles, roles, and requirements', targetNodeId: 'context-ced-03', storeKey: 'challenge', value: 'ced-03' },

    // Context for CED-01 (Q3_1) — 4 options, different targets
    'ced01-already-identified': { id: 'ced01-already-identified', label: 'We have already identified an industry focus for an employer collaborative.', targetNodeId: 'resource-ai-identify-partners' },
    'ced01-need-focus': { id: 'ced01-need-focus', label: 'We need to identify an industry focus for an employer collaborative.', targetNodeId: 'resource-tpm-57-58' },
    'ced01-need-employers': { id: 'ced01-need-employers', label: 'We need to identify employers to invite to join the collaborative.', targetNodeId: 'followup-outreach' },
    'ced01-want-expand': { id: 'ced01-want-expand', label: 'We want to expand the number of employers in the collaborative.', targetNodeId: 'resource-ai-identify-partners' },

    // Context for CED-02 (Q3_2) — 1 option
    'ced02-same-industry': { id: 'ced02-same-industry', label: 'The employers in the collaborative are from the same industry or occupation cluster.', targetNodeId: 'followup-facilitation' },

    // Context for CED-03 (Q3_3) — 1 option
    'ced03-need-framework': { id: 'ced03-need-framework', label: 'The collaborative network needs a common skills framework aligned to occupations.', targetNodeId: 'followup-competency' },

    // Q4_1: Do you need outreach materials?
    'outreach-yes': { id: 'outreach-yes', label: 'Yes', targetNodeId: 'resource-tpm-59-64', storeKey: 'outreach', value: 'yes' },
    'outreach-no': { id: 'outreach-no', label: 'No', targetNodeId: 'end', storeKey: 'outreach', value: 'no' },

    // Q4_2: Do you need facilitation support?
    'facilitation-yes': { id: 'facilitation-yes', label: 'Yes', targetNodeId: 'resource-tpm-74-78', storeKey: 'facilitation', value: 'yes' },
    'facilitation-no': { id: 'facilitation-no', label: 'No', targetNodeId: 'followup-labor-data', storeKey: 'facilitation', value: 'no' },

    // Q4_3: Do you have labor market data?
    'labor-data-no': { id: 'labor-data-no', label: 'No', targetNodeId: 'resource-tpm-84-85-bls', storeKey: 'laborData', value: 'no' },
    'labor-data-yes': { id: 'labor-data-yes', label: 'Yes', targetNodeId: 'end', storeKey: 'laborData', value: 'yes' },

    // Q4_4: Do you need sample competency frameworks?
    'competency-yes': { id: 'competency-yes', label: 'Yes', targetNodeId: 'resource-internal-library', storeKey: 'competency', value: 'yes' },
    'competency-no': { id: 'competency-no', label: 'No', targetNodeId: 'followup-taxonomy', storeKey: 'competency', value: 'no' },

    // Q4_5: Do you need skills taxonomy resources?
    'taxonomy-yes': { id: 'taxonomy-yes', label: 'Yes', targetNodeId: 'resource-onet-lightcast', storeKey: 'taxonomy', value: 'yes' },
    'taxonomy-no': { id: 'taxonomy-no', label: 'No', targetNodeId: 'end', storeKey: 'taxonomy', value: 'no' },
};

// ── Nodes ────────────────────────────────────────────────────────────────────
const FOOTER = 'Return to this tool when you are ready to explore the next step.';

export const nodes = {
    'welcome': {
        id: 'welcome',
        type: 'welcome',
        layout: 'hero',
        challengeBar: false,
        heading: 'Welcome to the planning tool.',
        body: 'After answering a few quick questions we can get you started on your digital transformation.',
        edgeIds: ['cta-start'],
    },

    'category': {
        id: 'category',
        type: 'multiChoice',
        layout: 'hero',
        challengeBar: false,
        question: 'What category best describes your organization?',
        edgeIds: ['pick-employer', 'pick-education', 'pick-intermediary', 'pick-board', 'pick-state'],
    },

    'role': {
        id: 'role',
        type: 'multiChoice',
        layout: 'hero',
        challengeBar: false,
        question: 'What is your primary role?',
        edgeIds: ['pick-role-coord', 'pick-role-align', 'pick-role-track', 'pick-role-other'],
    },

    // Q2
    'challenge': {
        id: 'challenge',
        type: 'multiChoice',
        layout: 'hero',
        challengeBar: false,
        question: 'What challenge do you want to address?',
        edgeIds: ['pick-ced-01', 'pick-ced-02', 'pick-ced-03'],
    },

    // Q3_1
    'context-ced-01': {
        id: 'context-ced-01',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'What is your current context?',
        submitLabel: 'Next',
        edgeIds: ['ced01-already-identified', 'ced01-need-focus', 'ced01-need-employers', 'ced01-want-expand'],
    },

    // Q3_2
    'context-ced-02': {
        id: 'context-ced-02',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'What is your current context?',
        submitLabel: 'Next',
        edgeIds: ['ced02-same-industry'],
    },

    // Q3_3
    'context-ced-03': {
        id: 'context-ced-03',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'What is your current context?',
        submitLabel: 'Next',
        edgeIds: ['ced03-need-framework'],
    },

    // Q4_1
    'followup-outreach': {
        id: 'followup-outreach',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'Do you need outreach materials?',
        submitLabel: 'Next',
        edgeIds: ['outreach-yes', 'outreach-no'],
    },

    // Q4_2
    'followup-facilitation': {
        id: 'followup-facilitation',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'Do you need facilitation support?',
        submitLabel: 'Next',
        edgeIds: ['facilitation-yes', 'facilitation-no'],
    },

    // Q4_3
    'followup-labor-data': {
        id: 'followup-labor-data',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'Do you have labor market data?',
        submitLabel: 'Next',
        edgeIds: ['labor-data-no', 'labor-data-yes'],
    },

    // Q4_4
    'followup-competency': {
        id: 'followup-competency',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'Do you need sample competency frameworks?',
        submitLabel: 'Next',
        edgeIds: ['competency-yes', 'competency-no'],
    },

    // Q4_5
    'followup-taxonomy': {
        id: 'followup-taxonomy',
        type: 'radioSurvey',
        layout: 'compact',
        challengeBar: true,
        question: 'Do you need skills taxonomy resources?',
        submitLabel: 'Next',
        edgeIds: ['taxonomy-yes', 'taxonomy-no'],
    },

    // ── Resource nodes (terminal) ───────────────────────────────────────────
    'resource-ai-identify-partners': {
        id: 'resource-ai-identify-partners',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'AI Prompt – Identify Partners', footer: FOOTER }],
    },

    'resource-tpm-57-58': {
        id: 'resource-tpm-57-58',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'TPM Academy Curriculum p. 57–58', footer: FOOTER }],
    },

    'resource-tpm-59-64': {
        id: 'resource-tpm-59-64',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'TPM Academy Curriculum p. 59–64', footer: FOOTER }],
    },

    'resource-tpm-74-78': {
        id: 'resource-tpm-74-78',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'TPM Academy Curriculum p. 74–78', footer: FOOTER }],
    },

    'resource-tpm-84-85-bls': {
        id: 'resource-tpm-84-85-bls',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'TPM Academy p. 84–85 & BLS.gov', footer: FOOTER }],
    },

    'resource-internal-library': {
        id: 'resource-internal-library',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'Consult Internal Library', footer: FOOTER }],
    },

    'resource-onet-lightcast': {
        id: 'resource-onet-lightcast',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: 'O*NET & Lightcast Skills Library', footer: FOOTER }],
    },

    // ── End node ────────────────────────────────────────────────────────────
    'end': {
        id: 'end',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{ when: {}, recommendation: "You've completed this section.", footer: FOOTER }],
    },
};
