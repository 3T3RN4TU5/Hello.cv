/**
 * FEATURED PROJECTS — content strictly limited to what JEEVAN.pdf states.
 * Both featured projects were checked against github.com/Jeevan2410: neither
 * has a public repository, so no repo links are shown and details are not
 * embellished beyond the resume wording. The `accent` value is presentation
 * only (drives the 3D lighting on hover).
 */

export const featuredProjects = [
  {
    id: 'happy-tails',
    name: 'Happy Tails',
    tagline: 'Pet Store E-Commerce Platform',
    accent: '#f59e0b',
    accent2: '#fbbf24',
    stack: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
    overview:
      'A full-stack MERN e-commerce application for a pet store, built from end to end — from secure sign-in through browsing, cart and checkout to order fulfilment and store administration.',
    features: [
      'Secure user authentication',
      'Product browsing',
      'Cart management',
      'Order processing',
      'Admin dashboard',
      'Invoice generation',
      'Payment gateway integration',
      'Automated email notifications for order updates',
    ],
    repo: null, // no public repository — do not fabricate a link
    demo: null,
    icon: 'paw',
  },
  {
    id: 'library-analytics',
    name: 'Library Services Analytics',
    tagline: 'EDA & Predictive Modeling',
    accent: '#22d3ee',
    accent2: '#67e8f9',
    stack: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Plotly', 'Scikit-Learn'],
    overview:
      'A data analytics and machine-learning study on a library management dataset — exploratory analysis to uncover user behaviour patterns, followed by classification models to predict user comfort levels.',
    features: [
      'Full exploratory data analysis (EDA) pipeline with Pandas, Matplotlib, Seaborn & Plotly',
      'User behaviour pattern discovery from a library management dataset',
      'Logistic Regression and KNN classifiers to predict user comfort levels',
      'Measurable accuracy improvements across models',
    ],
    repo: null, // no public repository — do not fabricate a link
    demo: null,
    icon: 'chart',
  },
];

/**
 * Hidden project (easter egg) — verified real public repository.
 * github.com/Jeevan2410/Connect-4-game — vanilla JS game.
 */
export const hiddenProject = {
  name: 'Connect 4',
  repo: 'https://github.com/Jeevan2410/Connect-4-game',
  note: 'A hidden classic — discovered via the terminal. Built with vanilla JavaScript.',
};
