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
    'ced01-need-employers': { id: 'ced01-need-employers', label: 'We need to identify employers to invite to join the collaborative.', targetNodeId: 'resource-tpm-59-64' },
    'ced01-want-expand': { id: 'ced01-want-expand', label: 'We want to expand the number of employers in the collaborative.', targetNodeId: 'resource-ai-identify-partners' },

    // Context for CED-02 (Q3_2) — 1 option
    'ced02-same-industry': { id: 'ced02-same-industry', label: 'The employers in the collaborative are from the same industry or occupation cluster.', targetNodeId: 'resource-ced02' },

    // Context for CED-03 (Q3_3) — 1 option
    'ced03-need-framework': { id: 'ced03-need-framework', label: 'The collaborative network needs a common skills framework aligned to occupations.', targetNodeId: 'resource-ced03' },
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

    // ── Resource nodes (terminal) ───────────────────────────────────────────
    'resource-ai-identify-partners': {
        id: 'resource-ai-identify-partners',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{
            when: {},
            recommendation: 'AI Prompt Template – Identify Employers and Industry Partners for a Regional Collaborative',
            promptBlock: {
                label: 'Core Prompt',
                text: `I am organizing a regional employer collaborative focused on [INDUSTRY OR OCCUPATIONAL AREA] in [CITY/REGION/STATE].

Help me identify:
• Major employers in this industry in the region
• Small and mid-sized employers that may be important partners
• Local industry associations and trade organizations
• Chambers of commerce and economic development organizations connected to this industry
• Employer groups already collaborating on workforce or skills initiatives`,
            },
            footer: FOOTER,
        }],
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

    // CED-02: facilitation support + labor market data on one screen
    'resource-ced02': {
        id: 'resource-ced02',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{
            when: {},
            links: [
                { label: 'TPM Academy Curriculum p. 74–78', url: null },
                { label: 'TPM Academy Curriculum p. 84–85', url: null },
                { label: 'BLS Occupational Outlook Handbook', url: 'https://www.bls.gov/ooh/' },
            ],
            footer: FOOTER,
        }],
    },

    // CED-03: skills taxonomy framework on one screen
    'resource-ced03': {
        id: 'resource-ced03',
        type: 'results',
        layout: 'compact',
        challengeBar: true,
        edgeIds: [],
        resolvers: [{
            when: {},
            recommendation: 'Select a standard occupational classification taxonomy, framework or platform that has skills aligned to occupation titles.',
            links: [
                { label: 'Consult Internal Library', url: null },
                { label: 'O*NET', url: 'https://www.onetonline.org/' },
                { label: 'Lightcast Skills Library', url: 'https://lightcast.io/open-skills/categories' },
            ],
            footer: FOOTER,
        }],
    },
};
