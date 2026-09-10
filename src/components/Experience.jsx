import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { experience, internships } from '../data/profile.js';

export default function Experience() {
  return (
    <section id="experience" className="section" aria-label="Work experience">
      <div className="container">
        <SectionHeading
          index="03"
          kicker="Career path"
          title="Experience"
          note="Two professional roles plus four internships — exactly as listed on the résumé."
        />

        <div className="timeline">
          {experience.map((job, i) => (
            <Reveal key={job.role + job.org} delay={i * 0.12} className="tl-item">
              <article>
                <p className="tl-period">{job.period}</p>
                <h3 className="tl-role">{job.role}</h3>
                <p className="tl-org">
                  {job.org}
                  {job.client && <span className="client"> · {job.client}</span>}
                </p>
                <ul className="tl-points">
                  {job.points.map((p) => (
                    <li key={p.slice(0, 24)}>{p}</li>
                  ))}
                </ul>
                <div className="tl-tags">
                  {job.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="internships">
          <h3>Internships</h3>
          <div className="intern-grid">
            {internships.map((it) => (
              <div className="intern-card" key={it.org}>
                <p className="i-org">{it.org}</p>
                {it.detail && <p className="i-detail">{it.detail}</p>}
                {it.period && <p className="i-period">{it.period}</p>}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
