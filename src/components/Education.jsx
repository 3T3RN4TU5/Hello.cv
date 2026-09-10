import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { education, certifications } from '../data/profile.js';
import { AwardIcon, RibbonIcon, BookIcon } from './icons.jsx';

const CERT_ICONS = { award: AwardIcon, cert: RibbonIcon, diploma: BookIcon };

export function Education() {
  return (
    <section id="education" className="section" aria-label="Education">
      <div className="container">
        <SectionHeading
          index="05"
          kicker="Academics"
          title="Education"
          note="Scores and institutions exactly as stated on the résumé."
        />
        <div className="edu-grid">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.09}>
              <article className="edu-card">
                <p className="edu-degree">{e.degree}</p>
                <p className="edu-inst">{e.institution}</p>
                <div className="edu-foot">
                  <span className="edu-score">{e.score}</span>
                  <span className="edu-period">{e.period}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section id="certifications" className="section" aria-label="Certifications and achievements">
      <div className="container">
        <SectionHeading index="06" kicker="Recognition" title="Certifications & Achievements" />
        <div className="cert-grid">
          {certifications.map((c, i) => {
            const Icon = CERT_ICONS[c.kind] ?? RibbonIcon;
            return (
              <Reveal key={c.title} delay={i * 0.09}>
                <article className="cert-card">
                  <span className="cert-icon">
                    <Icon width={19} height={19} />
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.detail}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
