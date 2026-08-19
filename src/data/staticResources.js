export const staticResources = [
	// ── Foundational ──────────────────────────────────────────────────────────
	{
		id: 'glossary-learnwork',
		type: 'link',
		label: 'Ed & Workforce Term Glossary',
		description:
			'Definitions for common education and workforce terms from the Learn Work Ecosystem Library.',
		url: 'https://learnworkecosystemlibrary.com/glossary/',
		categories: ['foundational']
	},
	{
		id: 'ler-ecosystem-map',
		type: 'link',
		label: 'LER Ecosystem Map',
		description:
			'Stakeholder pages with roles, value propositions, and action areas for developing and adopting Learning and Employment Records.',
		url: 'https://lermap.t3networkhub.org/#map-start',
		categories: ['foundational']
	},
	{
		id: 'gen-ai-tracker',
		type: 'link',
		label: 'Generative AI Adoption Tracker',
		description:
			'Tracks adoption of generative AI tools across the education and workforce ecosystem.',
		url: 'https://www.genaiadoptiontracker.com/',
		categories: ['foundational']
	},
	{
		id: 'cfs-trusted-skills',
		type: 'link',
		label: 'Center for Skills (CFS) — Trusted Skills Infrastructure',
		description:
			"C-BEN's framework for building trusted, stackable skills credentials across education and workforce.",
		url: 'https://centerforskills.org/#building-blocks',
		categories: ['foundational']
	},
	{
		id: 'lightcast-taxonomy',
		type: 'link',
		label: 'Lightcast Skills Taxonomy',
		description:
			'Comprehensive taxonomy of skills used across labor market data and workforce planning.',
		url: 'https://lightcast.io/open-skills',
		categories: ['foundational']
	},
	// ── Training Alignment ─────────────────────────────────────────────────────
	{
		id: 'lightcast-speed-of-skill',
		type: 'link',
		label: 'The Speed of Skill Change',
		description:
			'Lightcast Future Ready report examining how quickly in-demand skills are evolving across industries.',
		url: 'https://lightcast.io/resources/research/speed-of-skill-change',
		categories: ['training-alignment']
	},
	{
		id: 'skills-validation-guidebook',
		type: 'pdf',
		label: 'Skills Validation Guidebook — Education Design Lab',
		description: '10-step guide for designing high-quality skill validators. October 2024.',
		url: 'https://eddesignlab.org/wp-content/uploads/2024/10/A-Skills-Validation-Guidebook-10-Steps-to-Design-a-High-Quality-Skill-Validator-October-2024.pdf',
		pages: '10 steps',
		categories: ['training-alignment']
	},
	// ── Employer Demand ────────────────────────────────────────────────────────
	{
		id: 'tpm-academy',
		type: 'link',
		label: 'TPM Academy Curriculum',
		description:
			'Covers employer collaboration and coordinating skills requirements (Strategies 1–3) and alignment with training providers (Strategies 4–5).',
		url: 'https://www.tpmacademy.org/the-curriculum/',
		categories: ['employer-demand', 'training-alignment']
	},
	{
		id: 'tpm-resource-videos',
		type: 'link',
		label: 'Talent Pipeline Management (TPM) Resource Videos',
		description: 'Overview of Talent Pipeline Management® (TPM) initiative and strategies.',
		url: 'https://www.uschamberfoundation.org/workforce/tpm-resource-videos',
		categories: ['employer-demand', 'training-alignment']
	},
	{
		id: 'skills-first-initiative',
		type: 'link',
		label: 'Skills-First Workforce Initiative',
		description:
			'Employer-led model for defining shared hiring needs and aligning training programs with industry requirements.',
		url: 'https://www.skills-first.org/',
		categories: ['employer-demand']
	},
	{
		id: 'shrm-action-planner',
		type: 'link',
		label: 'SHRM Foundation — Skilled Credentials Action Planner',
		description:
			'Self-paced tool with guided learning to assess organizational readiness and create a custom workplan for skills-first hiring strategies.',
		url: 'https://www.shrm.org/foundation/skills-first/action-planner',
		categories: ['employer-demand']
	},
	// ── Templates ──────────────────────────────────────────────────────────────
	{
		id: 'ai-prompt-identify-employer-partners',
		type: 'prompt',
		label: 'AI Prompt — Identify Employer Partners',
		description:
			'Use this prompt to identify potential employer, industry association, and chamber partners for a regional employer collaborative.',
		text: 'I am organizing a regional employer collaborative focused on [INDUSTRY OR OCCUPATIONAL AREA] in [CITY/REGION/STATE].\n\nHelp me identify:\n• Major employers in this industry in the region\n• Small and mid-sized employers that may be important partners\n• Local industry associations and trade organizations\n• Chambers of commerce and economic development organizations connected to this industry\n• Employer groups already collaborating on workforce or skills initiatives',
		categories: ['templates']
	},
	{
		id: 'ai-prompt-normalize-employer-skill-language',
		type: 'prompt',
		label: 'AI Prompt — Normalize Employer Skill Language',
		description:
			'Use this prompt to standardize employer job titles and skill language into a shared occupational skill standard.',
		text: 'I am helping employers in [INDUSTRY/REGION] align on skills for [ROLE/OCCUPATION].\n\nInputs:\n- Employer job titles/title variations: [PASTE TITLES]\n- Employer-provided skill terms or job-description excerpts: [PASTE NON-CONFIDENTIAL TEXT]\n- Preferred taxonomy or reference framework: [O*NET / Lightcast / CTDL / other]\n\nTask:\n1. Group similar job titles into a standardized occupation profile.\n2. Extract technical skills, durable/human skills, knowledge areas, tools/technologies, and credentials.\n3. Normalize duplicate or inconsistent skill terms using the selected taxonomy.\n4. Separate required day-one skills, skills that can be learned after hire, and skills that distinguish entry-level, journeyman/intermediate, and advanced roles.\n5. Produce a draft shared occupational skill standard that employers can validate.\n\nOutput format:\n- Standardized occupation name\n- Title variations mapped to the occupation\n- Skill category table\n- Required vs preferred skills\n- Proficiency levels\n- Questions for employer validation',
		categories: ['templates']
	},
	{
		id: 'ai-prompt-identify-training-providers',
		type: 'prompt',
		label: 'AI Prompt — Identify Training Providers',
		description:
			'Use this prompt to identify training providers and credentialing programs aligned to priority occupations and skills.',
		text: 'I am managing an employer collaborative that has identified priority occupations and skills. Help me identify training providers with courses or programs focused on [OCCUPATION or SKILL] in [CITY/REGION/STATE].\nHelp me identify:\n• Training providers that offer related courses in the region\n• Programs that issue certificates or credentials in the region',
		categories: ['templates']
	},
	{
		id: 'employer-collaborative-invitation-template',
		type: 'pdf',
		label: 'Employer Collaborative Invitation Letter Template',
		description:
			'Use the invitation letter template to invite employers to join the collaborative.',
		url: '/api/resources/files/8fb66927-1978-4f4c-ba96-576e9b7a7f2c.pdf',
		wholeDocument: true,
		categories: ['templates']
	}
];
