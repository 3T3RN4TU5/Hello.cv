import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { profile } from '../data/profile.js';
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, CopyIcon } from './icons.jsx';
import { useApp } from '../state/AppContext.jsx';

/** Highlights are strictly derived from the resume summary wording. */
const HIGHLIGHTS = [
  {
    title: 'Full-Stack MERN',
    text: 'Building secure, scalable MERN stack applications from end to end.',
  },
  {
    title: 'APIs & Databases',
    text: 'REST API integration, database management, and secure web application work.',
  },
  {
    title: 'Data & ML',
    text: 'Data analytics and predictive modeling with Python tooling.',
  },
];

export default function About() {
  const { pushToast } = useApp();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      pushToast('Email copied to clipboard');
    } catch {
      pushToast(profile.email);
    }
  };

  return (
    <section id="about" className="section" aria-label="About">
      <div className="container">
        <SectionHeading index="01" kicker="Who am I" title="About" />
        <div className="about-grid">
          <Reveal>
            <p className="about-lede">
              I'm <span className="hl">Jeevan</span> — a Full-Stack Web Developer and MCA graduate
              who ships complete products, from database schema to deployed interface.
            </p>
            <p className="about-body">{profile.summary}</p>
            <div className="about-chips">
              {['MERN Stack', 'REST APIs', 'Data Analytics', 'Predictive Modeling', 'Compliance Management'].map(
                (c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                )
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="fact-card">
              <a className="fact-row" href={`mailto:${profile.email}`}>
                <span className="fact-icon">
                  <MailIcon width={17} height={17} />
                </span>
                <span>
                  <span className="fact-label">Email</span>
                  <span className="fact-value">{profile.email}</span>
                </span>
              </a>
              <button
                className="fact-row"
                onClick={copyEmail}
                aria-label={`Copy email ${profile.email}`}
              >
                <span className="fact-icon">
                  <CopyIcon width={17} height={17} />
                </span>
                <span>
                  <span className="fact-label">Quick copy</span>
                  <span className="fact-value">Copy email address</span>
                </span>
              </button>
              <a className="fact-row" href={`tel:${profile.phoneHref}`}>
                <span className="fact-icon">
                  <PhoneIcon width={17} height={17} />
                </span>
                <span>
                  <span className="fact-label">Phone</span>
                  <span className="fact-value">{profile.phone}</span>
                </span>
              </a>
              <a className="fact-row" href={profile.github} target="_blank" rel="noreferrer">
                <span className="fact-icon">
                  <GitHubIcon width={17} height={17} />
                </span>
                <span>
                  <span className="fact-label">GitHub</span>
                  <span className="fact-value">github.com/{profile.githubUser}</span>
                </span>
              </a>
              <a className="fact-row" href={profile.linkedin} target="_blank" rel="noreferrer">
                <span className="fact-icon">
                  <LinkedInIcon width={17} height={17} />
                </span>
                <span>
                  <span className="fact-label">LinkedIn</span>
                  <span className="fact-value">in/jeevan-kumar001</span>
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="skills-static" style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={0.1 + i * 0.1}>
              <div className="skill-card">
                <h3>
                  <span className="legend-dot" style={{ '--cat-color': 'var(--accent)' }} />
                  {h.title}
                </h3>
                <p>{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
