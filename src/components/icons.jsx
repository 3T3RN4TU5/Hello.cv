/** Minimal inline SVG icon set (16–20px, stroke-based). */

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const MailIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const PhoneIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z" />
  </svg>
);

export const GitHubIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 4 10.1c0 5 3 6.2 6 6.5a3.4 3.4 0 0 0-1 2.6V22" />
  </svg>
);

export const LinkedInIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v1.5A5.9 5.9 0 0 1 16 8Z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const DownloadIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);

export const ArrowIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ExternalIcon = (props) => (
  <svg {...base} width={14} height={14} {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6" />
    <path d="m10 14 11-11" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const TerminalIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m4 17 6-6-6-6" />
    <path d="M12 19h8" />
  </svg>
);

export const AwardIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="9" r="6" />
    <path d="m8.2 13.9-1.7 7.1L12 18l5.5 3-1.7-7.1" />
  </svg>
);

export const RibbonIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="m12 3-1.7 4.5M12 3l1.7 4.5M3.5 9.8 8 11.2M20.5 9.8 16 11.2M5 18.5l4-3.5M19 18.5l-4-3.5" />
  </svg>
);

export const BookIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </svg>
);

export const PawIcon = (props) => (
  <svg {...base} width={34} height={34} {...props}>
    <circle cx="6.5" cy="9" r="2" />
    <circle cx="10.2" cy="5.5" r="2" />
    <circle cx="14.8" cy="5.5" r="2" />
    <circle cx="18.5" cy="9" r="2" />
    <path d="M12.5 10.5c-3 0-5.5 2.7-5.5 5.2 0 1.8 1.3 2.8 2.7 2.8 1 0 1.8-.5 2.8-.5s1.8.5 2.8.5c1.4 0 2.7-1 2.7-2.8 0-2.5-2.5-5.2-5.5-5.2Z" />
  </svg>
);

export const ChartIcon = (props) => (
  <svg {...base} width={34} height={34} {...props}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="m7 14 4-4 3 3 5-6" />
  </svg>
);

export const CopyIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
