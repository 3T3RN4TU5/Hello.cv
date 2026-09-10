import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../state/AppContext.jsx';
import { profile } from '../data/profile.js';
import { skills } from '../data/profile.js';
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowIcon, DownloadIcon } from './icons.jsx';
import { useReducedMotion } from '../hooks/useEnvironment.js';

/** All role lines are directly supported by the resume summary/experience. */
const ROLES = [
  'Full-Stack Web Developer',
  'MERN Stack Developer',
  'Data Analytics & Predictive Modeling',
  'Secure Web Application Developer',
];

const NAME = 'Jeevan'.split('');

const MARQUEE = Object.values(skills).flatMap((s) => s.items);

function useTypewriter(reduced) {
  const [text, setText] = useState(reduced ? ROLES[0] : '');
  useEffect(() => {
    if (reduced) return undefined;
    let role = 0;
    let char = 0;
    let deleting = false;
    let timer;
    const step = () => {
      const current = ROLES[role];
      if (!deleting) {
        char += 1;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(step, 2100);
          return;
        }
        timer = setTimeout(step, 55);
      } else {
        char -= 1;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          role = (role + 1) % ROLES.length;
        }
        timer = setTimeout(step, 26);
      }
    };
    timer = setTimeout(step, 500);
    return () => clearTimeout(timer);
  }, [reduced]);
  return text;
}

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ webgl }) {
  const { goto } = useApp();
  const reduced = useReducedMotion();
  const role = useTypewriter(reduced);

  const item = (delay) => ({
    initial: { opacity: 0, y: 34 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section id="hero" className="hero" aria-label="Introduction">
      {!webgl && (
        <div className="hero-fallback" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
      )}

      <div className="container hero-inner">
        <motion.p className="hero-kicker" {...item(0.15)}>
          <span className="pulse-dot" aria-hidden="true" />
          Hello, I am
        </motion.p>

        <h1 className="hero-name" aria-label="Jeevan">
          {NAME.map((letter, i) => (
            <span className="letter-mask" key={i} aria-hidden="true">
              <motion.span
                className="letter grad"
                initial={{ y: '115%', rotate: 6 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p className="hero-roles" {...item(0.72)}>
          <span className="role-label">&gt;_</span>
          <span className="role-text">{role}</span>
        </motion.p>

        <motion.p className="hero-summary" {...item(0.85)}>
          I build secure, scalable MERN stack applications end to end — and work across data
          analytics and predictive modeling.
        </motion.p>

        <motion.div className="hero-ctas" {...item(1)}>
          <button className="btn btn-primary" onClick={() => goto('projects')} data-magnetic>
            View Projects <ArrowIcon width={16} height={16} className="btn-arrow" />
          </button>
          <a className="btn btn-ghost" href={profile.resume} target="_blank" rel="noreferrer" data-magnetic>
            <DownloadIcon width={16} height={16} /> Résumé
          </a>
          <button className="btn btn-ghost" onClick={() => goto('contact')} data-magnetic>
            Get in Touch
          </button>
        </motion.div>

        <motion.div className="hero-meta" {...item(1.12)}>
          <a href={`mailto:${profile.email}`}>
            <MailIcon width={14} height={14} /> {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            <GitHubIcon width={14} height={14} /> {profile.githubUser}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon width={14} height={14} /> jeevan-kumar001
          </a>
        </motion.div>
      </div>

      {/* skills marquee — every item straight from the résumé */}
      <motion.div
        className="marquee"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        aria-hidden="true"
      >
        <div className={`marquee-track ${reduced ? 'static' : ''}`}>
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy}>
              {MARQUEE.map((tech) => (
                <span className="marquee-item" key={copy + tech}>
                  {tech} <span className="marquee-dot">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        aria-hidden="true"
      >
        <div className="mouse" />
        scroll
      </motion.div>
    </section>
  );
}
