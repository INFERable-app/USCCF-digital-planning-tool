# Content Spec: Wizard Graph Data

Content is defined in `src/graph/wizardGraph.js` as two objects: `nodes` and `edges`. A `node` represents a question (such as "What is your context?") and an `edge` represents a potential answer (e.g. "We have already identified an industry focus for an employer collaborative.").

---

## Node

A node is one screen in the wizard. It defines what the user sees: a question, a video, a list of options, or a results screen. Every node has a `type` that determines which screen layout renders, and an `edgeIds` list that defines what answer options or buttons appear on that screen.

Nodes do not contain the answer options themselves — those are defined separately as edges. A node just lists the IDs of the edges that belong to it, in the order they should appear.

All nodes share these fields:

| Field          | Required | Type     | Values                                                                                   |
| -------------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `id`           | ✓        | string   | Unique.                                                                                  |
| `label`        |          | string   | Human-readable display name for the graph editor. Falls back to `id` if omitted.        |
| `type`         | ✓        | string   | `"welcome"` `"multiChoice"` `"radioSurvey"` `"checkboxSurvey"` `"videoInfo"` `"results"` |
| `layout`       | ✓        | string   | `"hero"` (large header + photo) or `"compact"` (small header)                            |
| `challengeBar` | ✓        | boolean  | Show the blue challenge title bar.                                                       |
| `edgeIds`      | ✓        | string[] | Ordered list of edge IDs. Controls what options/buttons appear and in what order.        |
| `positionX`    |          | number   | Canvas X position in the graph editor. Omit to have the editor auto-place the node.      |
| `positionY`    |          | number   | Canvas Y position in the graph editor. Omit to have the editor auto-place the node.      |

---

## Node types

### `welcome`

```json
{
 "id": "welcome",
 "type": "welcome",
 "layout": "hero",
 "challengeBar": false,
 "heading": "Welcome to the planning tool.",
 "body": "After answering a few quick questions we can get you started.",
 "edgeIds": ["cta-start"]
}
```

| Extra field | Required | Type   | Notes                    |
| ----------- | -------- | ------ | ------------------------ |
| `heading`   | ✓        | string | Large heading text.      |
| `body`      | ✓        | string | Subheading / intro text. |

---

### `multiChoice`

Tap-to-advance button list. No separate submit — tapping a button immediately navigates.

```json
{
 "id": "challenge",
 "type": "multiChoice",
 "layout": "hero",
 "challengeBar": false,
 "question": "What challenge do you want to address?",
 "edgeIds": ["pick-ced-01", "pick-ced-02", "pick-ced-03"]
}
```

| Extra field | Required | Type   | Notes                                  |
| ----------- | -------- | ------ | -------------------------------------- |
| `question`  | ✓        | string | Question text shown above the buttons. |

---

### `radioSurvey`

Radio button list with a submit button. User picks one option, then taps the button to advance. Each option (edge) can navigate to a different node.

```json
{
 "id": "context-ced-01",
 "type": "radioSurvey",
 "layout": "compact",
 "challengeBar": true,
 "question": "What is your current context?",
 "submitLabel": "Next",
 "edgeIds": [
  "ced01-already-identified",
  "ced01-need-focus",
  "ced01-need-employers",
  "ced01-want-expand"
 ]
}
```

| Extra field   | Required | Type   | Notes                                   |
| ------------- | -------- | ------ | --------------------------------------- |
| `question`    | ✓        | string | Question text.                          |
| `submitLabel` |          | string | Submit button label. Default: `"Next"`. |

---

### `checkboxSurvey`

Checkbox list with a submit button. User can select multiple options. All selected values are stored together as an array.

```json
{
 "id": "skills-survey",
 "type": "checkboxSurvey",
 "layout": "compact",
 "challengeBar": true,
 "question": "Select all that apply.",
 "submitLabel": "Submit",
 "submitEdgeId": "submit-skills",
 "edgeIds": ["opt-a", "opt-b", "opt-c"]
}
```

| Extra field    | Required | Type   | Notes                                                                                            |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------ |
| `question`     | ✓        | string | Question text.                                                                                   |
| `submitEdgeId` | ✓        | string | Edge ID for the submit button. This edge's `storeKey` receives the array of selected option IDs. |
| `submitLabel`  |          | string | Submit button label. Default: `"Submit"`.                                                        |

---

### `videoInfo`

Embedded video with a Next button. No user selection.

```json
{
 "id": "intro-video",
 "type": "videoInfo",
 "layout": "compact",
 "challengeBar": true,
 "videoUrl": "https://...",
 "videoAlt": "Video description for accessibility",
 "edgeIds": ["after-video"]
}
```

| Extra field | Required | Type   | Notes                                        |
| ----------- | -------- | ------ | -------------------------------------------- |
| `videoUrl`  | ✓        | string | Embed URL for the video.                     |
| `videoAlt`  |          | string | Accessible description of the video content. |

---

### `results`

Terminal screen. Shows recommendations, resources, and/or an AI prompt. Content is selected at runtime by matching the user's accumulated answers against the `resolvers` array.

```json
{
  "id": "resource-ced03",
  "type": "results",
  "layout": "compact",
  "challengeBar": true,
  "edgeIds": [],
  "resolvers": [...]
}
```

`edgeIds` is always `[]` for results nodes (no outgoing choices).

---

## Edge

An edge is one answer option or button. It connects two nodes: when a user selects an option or taps a button, the app follows that edge to the next node.

Edges are referenced by nodes via `edgeIds`. The order of IDs in `edgeIds` controls the order the options appear on screen.

An edge can optionally record the user's answer by writing a value into a named slot (via `storeKey` and `value`). Those recorded answers are later used to determine which content to show on the results screen.

```json
{
 "id": "pick-employer",
 "label": "Employer",
 "targetNodeId": "role",
 "storeKey": "category",
 "value": "employer",
 "disabled": false
}
```

| Field          | Required | Type    | Notes                                                                                                 |
| -------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `id`           | ✓        | string  | Unique. Must match its key in the `edges` object.                                                     |
| `label`        | ✓        | string  | Text shown to the user (button label, radio option, checkbox label).                                  |
| `targetNodeId` | ✓        | string  | ID of the node to navigate to when this edge is taken.                                                |
| `storeKey`     |          | string  | Answers key to write into when this edge is taken (e.g. `"category"`, `"challenge"`).                 |
| `value`        |          | string  | Value to store at `storeKey`. Omit only for checkbox submit edges (value is the array of selections). |
| `disabled`     |          | boolean | Renders grayed out and unclickable. Default: `false`.                                                 |

---

## Resolvers

A `results` node contains a `resolvers` array. The first resolver whose `when` conditions match the user's answers is rendered. If none match, the last one is used as a fallback.

`when: {}` (empty object) always matches — use this when there is only one possible outcome for the node.

```json
{
  "when": { "challenge": ["ced-01", "ced-02"] },
  "recommendation": "Red-highlighted lead sentence.",
  "bodyText": "Additional plain text. Use \\n for line breaks.",
  "resources": [...],
  "promptBlock": { "label": "AI Prompt Template", "text": "Prompt text here..." },
  "footer": "Return to this tool when you are ready to explore the next step."
}
```

| Field            | Type       | Notes                                                                                                                                               |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `when`           | object     | Keys are answer keys (e.g. `"challenge"`), values are arrays of accepted answer values. AND across keys, OR within each array. `{}` always matches. |
| `recommendation` | string     | Rendered in red as the lead recommendation sentence.                                                                                                |
| `bodyText`       | string     | Plain body text. Supports `\n` for line breaks.                                                                                                     |
| `resources`      | Resource[] | List of typed resource items (PDF, link, or reference). See below.                                                                                  |
| `promptBlock`    | object     | Editable AI prompt textarea with copy button: `{ "label": string, "text": string }`                                                                 |
| `footer`         | string     | Small gray closing line.                                                                                                                            |

All fields except `when` are optional — include only what the screen needs.

---

## Resource items

Resources appear as cards inside a resolver. Three types:

### `pdf`

```json
{
 "type": "pdf",
 "label": "TPM Academy Curriculum",
 "pages": "57–58",
 "url": "https://example.com/doc.pdf#page=57"
}
```

| Field         | Required | Notes                                                                             |
| ------------- | -------- | --------------------------------------------------------------------------------- |
| `label`       | ✓        | Name of the document.                                                             |
| `pages`       | ✓        | Page range shown as a badge (e.g. `"57–58"`).                                     |
| `url`         |          | PDF URL with `#page=N` to open at a specific page. Omit to render without a link. |
| `description` |          | Optional free text shown inside the card, below the label/badge.                  |

### `link`

```json
{ "type": "link", "label": "BLS Occupational Outlook Handbook", "url": "https://www.bls.gov/ooh/" }
```

| Field         | Required | Notes                                                            |
| ------------- | -------- | ---------------------------------------------------------------- |
| `label`       | ✓        | Link text.                                                       |
| `url`         | ✓        | External URL. Opens in a new tab.                                |
| `description` |          | Optional free text shown inside the card, below the label/arrow. |

### `reference`

```json
{ "type": "reference", "label": "Consult Internal Library" }
```

| Field         | Required | Notes                                                                                                            |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `label`       | ✓        | Text displayed for the internal/unlinkable resource.                                                             |
| `description` |          | Optional free text. When present, renders as a bordered card with the label as its header instead of plain text. |

## Example implementation of Coordinating Employer Demand use case

```javascript
export const startNodeId = 'welcome';

export const challengeLabels = {
 'ced-01': 'Establish/Expand network',
 'ced-02': 'Convene employers',
 'ced-03': 'Build consensus'
};

// ── Edges ────────────────────────────────────────────────────────────────────
export const edges = {
 // Welcome
 //'cta-start': { id: 'cta-start', label: "Let's get started!", targetNodeId: 'category' },
 'cta-start': {
  id: 'cta-start',
  label: "Let's get started!",
  targetNodeId: 'role',
  storeKey: 'category',
  value: 'employer'
 },

 // Category — only Employer active
 'pick-employer': {
  id: 'pick-employer',
  label: 'Employer',
  targetNodeId: 'role',
  storeKey: 'category',
  value: 'employer'
 },
 'pick-education': {
  id: 'pick-education',
  label: 'Education Providers',
  targetNodeId: 'role',
  storeKey: 'category',
  value: 'education',
  disabled: true
 },
 'pick-intermediary': {
  id: 'pick-intermediary',
  label: 'Workforce Intermediary',
  targetNodeId: 'role',
  storeKey: 'category',
  value: 'intermediary',
  disabled: true
 },
 'pick-board': {
  id: 'pick-board',
  label: 'Workforce Board',
  targetNodeId: 'role',
  storeKey: 'category',
  value: 'board',
  disabled: true
 },
 'pick-state': {
  id: 'pick-state',
  label: 'State Agency',
  targetNodeId: 'role',
  storeKey: 'category',
  value: 'state',
  disabled: true
 },

 // Role — only Coordinating Employer Demand active
 'pick-role-coord': {
  id: 'pick-role-coord',
  label: 'Coordinating employer demand',
  targetNodeId: 'challenge',
  storeKey: 'role',
  value: 'coordinating'
 },
 'pick-role-align': {
  id: 'pick-role-align',
  label: 'Aligning training with industry needs',
  targetNodeId: 'challenge',
  storeKey: 'role',
  value: 'aligning',
  disabled: true
 },
 'pick-role-track': {
  id: 'pick-role-track',
  label: 'Tracking talent pipeline outcomes',
  targetNodeId: 'challenge',
  storeKey: 'role',
  value: 'tracking',
  disabled: true
 },
 'pick-role-other': {
  id: 'pick-role-other',
  label: 'Other',
  targetNodeId: 'challenge',
  storeKey: 'role',
  value: 'other',
  disabled: true
 },

 // Challenge (Q2)
 'pick-ced-01': {
  id: 'pick-ced-01',
  label: 'Establish/Expand employer collaborative network',
  targetNodeId: 'context-ced-01',
  storeKey: 'challenge',
  value: 'ced-01'
 },
 'pick-ced-02': {
  id: 'pick-ced-02',
  label: 'Convene employers to define shared hiring needs',
  targetNodeId: 'context-ced-02',
  storeKey: 'challenge',
  value: 'ced-02'
 },
 'pick-ced-03': {
  id: 'pick-ced-03',
  label: 'Build consensus on common job titles, roles, and requirements',
  targetNodeId: 'context-ced-03',
  storeKey: 'challenge',
  value: 'ced-03'
 },

 // Context for CED-01 (Q3_1) — 4 options, different targets
 'ced01-already-identified': {
  id: 'ced01-already-identified',
  label: 'We have already identified an industry focus for an employer collaborative.',
  targetNodeId: 'resource-ai-identify-partners'
 },
 'ced01-need-focus': {
  id: 'ced01-need-focus',
  label: 'We need to identify an industry focus for an employer collaborative.',
  targetNodeId: 'resource-tpm-57-58'
 },
 'ced01-need-employers': {
  id: 'ced01-need-employers',
  label: 'We need to identify employers to invite to join the collaborative.',
  targetNodeId: 'resource-tpm-59-64'
 },
 'ced01-want-expand': {
  id: 'ced01-want-expand',
  label: 'We want to expand the number of employers in the collaborative.',
  targetNodeId: 'resource-want-expand'
 },

 // Context for CED-02 (Q3_2) — 1 option
 'ced02-same-industry': {
  id: 'ced02-same-industry',
  label: 'The employers in the collaborative are from the same industry or occupation cluster.',
  targetNodeId: 'resource-ced02'
 },

 // Context for CED-03 (Q3_3) — 1 option
 'ced03-need-framework': {
  id: 'ced03-need-framework',
  label: 'The collaborative network needs a common skills framework aligned to occupations.',
  targetNodeId: 'resource-ced03'
 }
};

// ── Nodes ────────────────────────────────────────────────────────────────────
const FOOTER = 'Return to this tool when you are ready to explore the next step.';
const TPM_PDF =
 'https://www.tpmacademy.org/wp-content/uploads/2024/06/TPM-5.0_Curriculum_FINAL.pdf';
const AI_PROMPT_IDENTIFY = `I am organizing a regional employer collaborative focused on [INDUSTRY OR OCCUPATIONAL AREA] in [CITY/REGION/STATE].

Help me identify:
• Major employers in this industry in the region
• Small and mid-sized employers that may be important partners
• Local industry associations and trade organizations
• Chambers of commerce and economic development organizations connected to this industry
• Employer groups already collaborating on workforce or skills initiatives`;

export const nodes = {
 welcome: {
  id: 'welcome',
  type: 'welcome',
  layout: 'hero',
  challengeBar: false,
  heading: 'Welcome to the planning tool.',
  body: 'After answering a few quick questions we can get you started on your digital transformation.',
  edgeIds: ['cta-start']
 },

 category: {
  id: 'category',
  type: 'multiChoice',
  layout: 'hero',
  challengeBar: false,
  question: 'What category best describes your organization?',
  edgeIds: ['pick-employer', 'pick-education', 'pick-intermediary', 'pick-board', 'pick-state']
 },

 role: {
  id: 'role',
  type: 'multiChoice',
  layout: 'hero',
  challengeBar: false,
  question: 'What is your primary role?',
  // edgeIds: ['pick-role-coord', 'pick-role-align', 'pick-role-track', 'pick-role-other'],
  edgeIds: ['pick-role-coord']
 },

 // Q2
 challenge: {
  id: 'challenge',
  type: 'multiChoice',
  layout: 'hero',
  challengeBar: false,
  question: 'What challenge do you want to address?',
  edgeIds: ['pick-ced-01', 'pick-ced-02', 'pick-ced-03']
 },

 // Q3_1
 'context-ced-01': {
  id: 'context-ced-01',
  type: 'radioSurvey',
  layout: 'compact',
  challengeBar: true,
  question: 'What is your current context?',
  submitLabel: 'Next',
  edgeIds: [
   'ced01-already-identified',
   'ced01-need-focus',
   'ced01-need-employers',
   'ced01-want-expand'
  ]
 },

 // Q3_2
 'context-ced-02': {
  id: 'context-ced-02',
  type: 'radioSurvey',
  layout: 'compact',
  challengeBar: true,
  question: 'What is your current context?',
  submitLabel: 'Next',
  edgeIds: ['ced02-same-industry']
 },

 // Q3_3
 'context-ced-03': {
  id: 'context-ced-03',
  type: 'radioSurvey',
  layout: 'compact',
  challengeBar: true,
  question: 'What is your current context?',
  submitLabel: 'Next',
  edgeIds: ['ced03-need-framework']
 },

 // ── Resource nodes (terminal) ───────────────────────────────────────────
 'resource-ai-identify-partners': {
  id: 'resource-ai-identify-partners',
  type: 'results',
  layout: 'compact',
  challengeBar: true,
  edgeIds: [],
  resolvers: [
   {
    when: {},
    recommendation:
     'Identify local industry associations and organizations that align with your industry focus.',
    promptBlock: { label: 'AI Prompt Template', text: AI_PROMPT_IDENTIFY },
    footer: FOOTER
   }
  ]
 },

 'resource-want-expand': {
  id: 'resource-want-expand',
  type: 'results',
  layout: 'compact',
  challengeBar: true,
  edgeIds: [],
  resolvers: [
   {
    when: {},
    recommendation: 'Apply strategies to find employer points of contact for target industry.',
    promptBlock: { label: 'AI Prompt Template', text: AI_PROMPT_IDENTIFY },
    bodyText: 'Consider creating an outreach/recruiting toolkit.',
    footer: FOOTER
   }
  ]
 },

 'resource-tpm-57-58': {
  id: 'resource-tpm-57-58',
  type: 'results',
  layout: 'compact',
  challengeBar: true,
  edgeIds: [],
  resolvers: [
   {
    when: {},
    recommendation:
     'The following activity can help you take steps towards determining the focus of a collaborative.',
    resources: [
     {
      type: 'pdf',
      label: 'TPM Academy Curriculum',
      pages: '57–58',
      url: `${TPM_PDF}#page=243`
     }
    ],
    footer: FOOTER
   }
  ]
 },

 'resource-tpm-59-64': {
  id: 'resource-tpm-59-64',
  type: 'results',
  layout: 'compact',
  challengeBar: true,
  edgeIds: [],
  resolvers: [
   {
    when: {},
    bodyText: `When standing up a collaborative, consider the following:\n• Who will host the collaborative?\n• What will be the size and geographic scope of the collaborative?\n• How will the collaborative be financed?\n• How will the collaborative share information?`,
    resources: [
     {
      type: 'pdf',
      label: 'TPM Academy Curriculum',
      pages: '59–64',
      url: `${TPM_PDF}#page=245`
     }
    ],
    footer: FOOTER
   }
  ]
 },

 // CED-02: facilitation support + labor market data on one screen
 'resource-ced02': {
  id: 'resource-ced02',
  type: 'results',
  layout: 'compact',
  challengeBar: true,
  edgeIds: [],
  resolvers: [
   {
    when: {},
    recommendation:
     'After identifying and recruiting employers, make plans to bring the employers together to discuss shared needs.',
    bodyText:
     'Facilitate demand planning around priority occupations. Review resources that provide data on occupational outlook and projections.',
    resources: [
     {
      type: 'pdf',
      label: 'TPM Academy Curriculum',
      pages: '74–78',
      url: `${TPM_PDF}#page=74`
     },
     {
      type: 'pdf',
      label: 'TPM Academy Curriculum',
      pages: '84–85',
      url: `${TPM_PDF}#page=84`
     },
     {
      type: 'link',
      label: 'BLS Occupational Outlook Handbook',
      url: 'https://www.bls.gov/ooh/'
     }
    ],
    footer: FOOTER
   }
  ]
 },

 // CED-03: skills taxonomy framework on one screen
 'resource-ced03': {
  id: 'resource-ced03',
  type: 'results',
  layout: 'compact',
  challengeBar: true,
  edgeIds: [],
  resolvers: [
   {
    when: {},
    recommendation:
     'Select a standard occupational classification taxonomy, framework or platform that has skills aligned to occupation titles.',
    resources: [
     { type: 'reference', label: 'Consult Internal Library' },
     { type: 'link', label: 'O*NET', url: 'https://www.onetonline.org/' },
     {
      type: 'link',
      label: 'Lightcast Skills Library',
      url: 'https://lightcast.io/open-skills/categories'
     }
    ],
    footer: FOOTER
   }
  ]
 }
};
```
