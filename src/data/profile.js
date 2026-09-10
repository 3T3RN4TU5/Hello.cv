/**
 * SINGLE SOURCE OF TRUTH — every fact below is taken verbatim from
 * JEEVAN.pdf / JEEVAN_resume.docx (verified identical) or from the public
 * GitHub profile github.com/Jeevan2410. Nothing here is invented.
 * If a value is unknown, it is omitted or null — never guessed.
 */

export const profile = {
  name: 'Jeevan',
  title: 'Full-Stack Web Developer',
  suffix: 'MCA Graduate',
  summary:
    'Full-Stack Web Developer and MCA graduate with hands-on experience building secure, scalable MERN stack applications from end to end. Skilled in REST API integration, database management, data analytics, and predictive modeling. Experienced in compliance management, cross-team coordination, and process documentation — effective across both software development and operations-driven roles.',
  email: 'jeevankumar24102001@gmail.com',
  phone: '+91 9353459119',
  phoneHref: '+919353459119',
  github: 'https://github.com/Jeevan2410',
  githubUser: 'Jeevan2410',
  linkedin: 'https://linkedin.com/in/jeevan-kumar001',
  resume: '/resume.pdf',
  // Resume lists no city — intentionally omitted.
};

export const skills = {
  Languages: {
    color: '#4f8cff',
    items: ['Java', 'C++', 'Python', 'JavaScript'],
    blurb: 'Core languages used across coursework, projects and professional work.',
  },
  Web: {
    color: '#22d3ee',
    items: ['HTML5', 'CSS3', 'React.js', 'Node.js', 'Express.js', 'PHP', 'REST APIs'],
    blurb: 'End-to-end web stack — markup, styling, frameworks and API design.',
  },
  Databases: {
    color: '#34d399',
    items: ['MySQL', 'MongoDB', 'Firebase'],
    blurb: 'Relational and NoSQL stores plus realtime backend services.',
  },
  Tools: {
    color: '#94a3b8',
    items: ['GitHub', 'Power BI', 'MS Office'],
    blurb: 'Everyday tooling for version control, analytics and documentation.',
  },
  'Data & ML': {
    color: '#8b5cf6',
    items: ['Pandas', 'Matplotlib', 'Seaborn', 'Plotly', 'Scikit-Learn'],
    blurb: 'Exploratory analysis, visualization and classical machine learning.',
  },
};

// Reverse-chronological (most recent first), exactly as dated on the resume.
export const experience = [
  {
    role: 'Operations Executive',
    org: 'Shaan Enterprises',
    client: 'Client: GAIL Mangalore Petrochemicals Ltd.',
    period: 'Dec 2025 – Jun 2026',
    points: [
      'Managed end-to-end office administration including work permit processing, documentation, and HSE compliance; oversaw manpower deployment and attendance tracking.',
      'Handled material requisition, inventory tracking, daily operational reporting, and liaison between site management and client representatives.',
    ],
    tags: ['Compliance', 'Documentation', 'Coordination'],
  },
  {
    role: 'Secure Web Developer',
    org: 'eInfratech Solutions',
    client: null,
    period: 'Jan 2025 – Jul 2025',
    points: [
      'Developed and maintained secure web applications implementing authentication, authorization, and data encryption best practices.',
      'Conducted vulnerability assessments, resolved security loopholes, and integrated secure APIs with cross-functional teams.',
    ],
    tags: ['Security', 'Authentication', 'APIs'],
  },
];

// Internships line, exactly as listed on the resume.
export const internships = [
  { org: 'AgilMinds', detail: 'MERN Stack', period: 'Jun – Sep 2024' },
  { org: 'CodSoft', detail: null, period: null },
  { org: 'Bharat Intern', detail: null, period: null },
  { org: 'SystemTron', detail: 'Full-Stack Web Dev', period: null },
];

export const education = [
  {
    degree: 'MCA',
    institution: 'St. Agnes College (Autonomous), Mangalore',
    score: 'CGPA 7.89',
    period: '2022–2024',
  },
  {
    degree: 'BCA',
    institution: 'Vijaya College, Mulki',
    score: 'CGPA 8.79',
    period: '2019–2022',
  },
  {
    degree: 'PUC',
    institution: 'Madeleine P.U. College, Mulki',
    score: '79.33%',
    period: '2017–2019',
  },
  {
    degree: 'SSLC',
    institution: 'Madeleine High School, Mulki',
    score: '76.48%',
    period: '2016–2017',
  },
];

export const certifications = [
  {
    title: 'Winner — Coding Event',
    detail: 'MEDHA-23 National Technical & Cultural Fest',
    kind: 'award',
  },
  {
    title: 'Gold Certified — Data Analytics with Microsoft Power BI',
    detail: 'NASSCOM',
    kind: 'cert',
  },
  {
    title: "NCC 'C' Certificate",
    detail: 'Awarded for completing National Cadet Corps training',
    kind: 'cert',
  },
  {
    title: 'Diploma in Computer Applications',
    detail: 'Kinnigoli Institution of Computer and Fashion Technology',
    kind: 'diploma',
  },
];

// Skill categories with counts, for the 3D constellation + fallback chips.
export const skillNodes = Object.entries(skills).map(([category, { items, color }]) => ({
  category,
  color,
  items,
}));
