export const staticResources = [
  // ── Start Here ─────────────────────────────────────────────────────────────
  {
    id: 'glossary-learnwork',
    type: 'link',
    label: 'Ed & Workforce Term Glossary',
    description:
      'Definitions for common education and workforce terms from the Learn Work Ecosystem Library.',
    url: 'https://learnworkecosystemlibrary.com/glossary/',
    categories: ['start']
  },
  {
    id: 'ler-ecosystem-map',
    type: 'link',
    label: 'LER Ecosystem Map',
    description:
      'Stakeholder pages with roles, value propositions, and action areas for developing and adopting Learning and Employment Records.',
    url: 'https://lermap.t3networkhub.org/#map-start',
    categories: ['start']
  },
  {
    id: 'edl-lers-overview',
    type: 'link',
    label: 'Education Design Lab — LERs Overview',
    description: 'Plain-language explainer of Learning & Employment Records and skills visibility.',
    url: 'https://eddesignlab.org/lers/',
    categories: ['start']
  },
  {
    id: 'cfs-trusted-skills',
    type: 'link',
    label: 'Center for Skills (CFS) — Trusted Skills Infrastructure',
    description:
      "C-BEN's framework for building trusted, stackable skills credentials across education and workforce.",
    url: 'https://centerforskills.org/#building-blocks',
    categories: ['start']
  },
  {
    id: 'gen-ai-tracker',
    type: 'link',
    label: 'Generative AI Adoption Tracker',
    description:
      'Tracks adoption of generative AI tools across the education and workforce ecosystem.',
    url: 'https://www.genaiadoptiontracker.com/',
    categories: ['start']
  },
  {
    id: 'tpm-academy',
    type: 'link',
    label: 'TPM Academy Curriculum',
    description:
      'Covers employer collaboration and coordinating skills requirements (Strategies 1–3) and alignment with training providers (Strategies 4–5).',
    url: 'https://www.tpmacademy.org/the-curriculum/',
    categories: ['start']
  },
  {
    id: 'tpm-resource-videos',
    type: 'link',
    label: 'Talent Pipeline Management (TPM) Resource Videos',
    description: 'Overview of Talent Pipeline Management® (TPM) initiative and strategies.',
    url: 'https://www.uschamberfoundation.org/workforce/tpm-resource-videos',
    categories: ['start']
  },
  // ── Coordinating Employer Demand ──────────────────────────────────────────
  {
    id: 'shrm-action-planner',
    type: 'link',
    label: 'SHRM Foundation — Skilled Credentials Action Planner',
    description:
      'Self-paced tool with guided learning to assess organizational readiness and create a custom workplan for skills-first hiring strategies.',
    url: 'https://www.shrm.org/foundation/skills-first/action-planner',
    categories: ['demand']
  },
  // ── Skills & Training Alignment ───────────────────────────────────────────
  {
    id: 'lightcast-taxonomy',
    type: 'link',
    label: 'Lightcast Skills Taxonomy',
    description:
      'Comprehensive taxonomy of skills used across labor market data and workforce planning.',
    url: 'https://lightcast.io/taxonomies/skills-taxonomy',
    categories: ['skills']
  },
  {
    id: 'lightcast-speed-of-skill',
    type: 'link',
    label: 'The Speed of Skill Change',
    description:
      'Lightcast Future Ready report examining how quickly in-demand skills are evolving across industries.',
    url: 'https://lightcast.io/resources/research/speed-of-skill-change',
    categories: ['skills']
  },
  {
    id: 'skills-validation-guidebook',
    type: 'pdf',
    label: 'Skills Validation Guidebook — Education Design Lab',
    description: '10-step guide for designing high-quality skill validators. October 2024.',
    url: 'https://eddesignlab.org/wp-content/uploads/2024/10/A-Skills-Validation-Guidebook-10-Steps-to-Design-a-High-Quality-Skill-Validator-October-2024.pdf',
    categories: ['skills']
  },
  {
    id: 'skills-first-initiative',
    type: 'link',
    label: 'Skills-First Workforce Initiative',
    description:
      'Employer-led model for defining shared hiring needs and aligning training programs with industry requirements.',
    url: 'https://www.skills-first.org/',
    categories: ['skills']
  },
  {
    id: 'credential-transparency-toolkit',
    type: 'link',
    label: 'Credential Engine — Credential Transparency Toolkit',
    description: 'Resources to learn, plan, and implement credential transparency initiatives.',
    url: 'https://credentialengine.org/credential-engine-partners/credential-transparency-toolkit/',
    categories: ['skills']
  },
  // ── Finding Training Providers ────────────────────────────────────────────
  {
    id: 'nces-cip-codes-finding-data',
    type: 'pdf',
    label: 'Finding Data Using CIP Codes',
    description:
      'Guide to identifying and using Classification of Instructional Programs (CIP) codes to find education program data.',
    url: 'https://nces.ed.gov/ipeds/cipcode/files/Finding_Data_CIP_Codes.pdf',
    categories: ['providers']
  },
  {
    id: 'careeronestop-wioa-training-finder',
    type: 'link',
    label: 'CareerOneStop — Find WIOA Training Programs',
    description: 'Search for WIOA-approved training programs by location and occupation.',
    url: 'https://www.careeronestop.org/LocalHelp/EmploymentAndTraining/find-WIOA-training-programs.aspx',
    categories: ['providers']
  },
  // ── Tracking Talent Pipelines ─────────────────────────────────────────────
  {
    id: 'ceds-connect',
    type: 'link',
    label: 'CEDS Connect (NCES)',
    description:
      'Tool for defining and analyzing shared metrics using common education data elements.',
    url: 'https://ceds.ed.gov/connect.aspx',
    categories: ['tracking']
  },
  // ── Templates & AI Prompts ────────────────────────────────────────────────
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

export const faqItems = [
  {
    id: 'what-is-the-tool',
    question: 'What is the Digital Transformation Planning Tool?',
    intro:
      'The Digital Transformation Planning Tool is a decision-support application for workforce intermediaries. It helps you quickly identify the next best actions for aligning employers, training providers, and workforce partners around shared skill and talent needs. The tool provides actionable recommendations based on your current workforce challenge.'
  },
  {
    id: 'what-recommendations',
    question: 'What kinds of recommendations will I receive?',
    intro: 'The tool provides guidance such as:',
    bullets: [
      'How to translate employer needs into skill requirements',
      'How to prioritize critical skills across employer collaboratives',
      'How to align training programs with workforce demand'
    ],
    outro: 'Each recommendation is designed to move your initiative forward.'
  },
  {
    id: 'templates-and-resources',
    question: 'Does the tool provide templates and resources?',
    intro:
      'Yes. Along with recommendations, the tool gives you **direct access to supporting resources**, including:',
    bullets: [
      'Templates for skills mapping and job description alignment',
      'Employer engagement and convening guides',
      'Training provider mapping tools',
      'Sample frameworks and checklists'
    ],
    outro: 'These resources are meant to help you take action without starting from scratch.'
  },
  {
    id: 'multiple-initiatives',
    question: 'Can I use this tool for multiple workforce initiatives?',
    intro: 'Yes. The tool is designed to support a range of activities, including:',
    bullets: [
      'Aligning training with industry needs',
      'Aggregating employer skill requirements',
      'Building talent pipelines',
      'Sharing demand signals with partners',
      'Identifying training gaps and opportunities'
    ],
    outro: 'You can return at any time and select a different activity.'
  },
  {
    id: 'technical-users',
    question: 'Is the tool only for technical users?',
    intro:
      'No. The tool is designed for **workforce practitioners, intermediaries, and partners with varying levels of technical expertise**. Guidance is written in plain language.'
  }
];

export const glossaryTerms = [
  {
    term: 'Workforce Intermediary',
    definition:
      'An organization that connects employers, education providers, and workforce programs to align training with job demand and help build talent pipelines.'
  },
  {
    term: 'Employer Collaborative',
    definition:
      'A group of employers in the same industry or region that work together to identify shared workforce needs and coordinate solutions.'
  },
  {
    term: 'Skills-Based Hiring',
    definition:
      'A hiring approach that focuses on the skills a person can demonstrate rather than only degrees, job titles, or years of experience.'
  },
  {
    term: 'Skills Taxonomy',
    definition:
      'A structured system that organizes and defines skills in a consistent way so employers, educators, and workforce partners use the same language.'
  },
  {
    term: 'Competency Framework',
    definition:
      'A structured description of what someone needs to know and be able to do in a job or role.'
  },
  {
    term: 'Career Pathway',
    definition:
      'A sequence of education, training, and jobs that lead to advancement in a specific occupation or industry.'
  },
  {
    term: 'Talent Pipeline',
    definition:
      'A system for developing and tracking individuals as they move through training and into employment.'
  },
  {
    term: 'Training Alignment',
    definition:
      'The process of matching education and training programs to the skills employers need.'
  },
  {
    term: 'Labor Market Demand Signal',
    definition:
      'Information from employers that shows what jobs, skills, and qualifications are currently needed.'
  },
  {
    term: 'Occupational Framework',
    definition:
      'A standardized way of grouping and describing jobs based on similar skills and responsibilities (e.g., O*NET).'
  },
  {
    term: 'Labor Market Information (LMI)',
    definition:
      'Data about jobs, wages, industries, and employment trends used to understand workforce demand.'
  }
];
