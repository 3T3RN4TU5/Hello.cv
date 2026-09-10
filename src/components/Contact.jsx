import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { profile } from '../data/profile.js';
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from './icons.jsx';

export default function Contact() {
  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="container contact-wrap">
        <SectionHeading index="08" kicker="Say hello" title="Contact" />
        <Reveal>
          <p className="contact-title">
            Let's build something <span className="grad">together</span>.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="contact-sub">
            Full-Stack Web Developer — MERN stack, data analytics and predictive modeling. The
            fastest way to reach me is email; the phone works too.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="contact-cards">
            <a className="contact-card" href={`mailto:${profile.email}`}>
              <MailIcon width={16} height={16} /> {profile.email}
            </a>
            <a className="contact-card" href={`tel:${profile.phoneHref}`}>
              <PhoneIcon width={16} height={16} /> {profile.phone}
            </a>
            <a className="contact-card" href={profile.github} target="_blank" rel="noreferrer">
              <GitHubIcon width={16} height={16} /> GitHub
            </a>
            <a className="contact-card" href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon width={16} height={16} /> LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
