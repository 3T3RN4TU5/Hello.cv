import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { featuredProjects } from '../data/projects.js';
import { useApp } from '../state/AppContext.jsx';
import { PawIcon, ChartIcon, CloseIcon, ArrowIcon, GitHubIcon, ExternalIcon } from './icons.jsx';

const ICONS = { paw: PawIcon, chart: ChartIcon };
const DEFAULT_ACCENT = '#4f8cff';

function ProjectCard({ project, index, onOpen }) {
  const { setAccent } = useApp();
  const ref = useRef(null);
  const Icon = ICONS[project.icon] ?? ChartIcon;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const enter = () => setAccent(project.accent);
  const leave = () => setAccent(DEFAULT_ACCENT);

  return (
    <Reveal delay={index * 0.12}>
      <button
        ref={ref}
        className="project-card"
        style={{ '--p-accent': project.accent }}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={enter}
        onBlur={leave}
        onMouseMove={onMove}
        onClick={() => onOpen(index)}
        aria-haspopup="dialog"
        aria-label={`${project.name} — ${project.tagline}. Open details.`}
      >
        <span className="project-icon" aria-hidden="true">
          <Icon />
        </span>
        <span className="project-main">
          <span className="p-index">Featured Project 0{index + 1}</span>
          <h3>{project.name}</h3>
          <span className="p-tagline">{project.tagline}</span>
          <span className="p-desc">{project.overview}</span>
          <span className="p-stack">
            {project.stack.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </span>
        </span>
        <span className="project-side" aria-hidden="true">
          <span className="project-open">
            Open
            <span className="open-ring">
              <ArrowIcon width={15} height={15} style={{ transform: 'rotate(-45deg)' }} />
            </span>
          </span>
        </span>
      </button>
    </Reveal>
  );
}

function ProjectModal({ index, onClose, onNav }) {
  const project = featuredProjects[index];
  const panelRef = useRef(null);
  const { setAccent } = useApp();
  const Icon = ICONS[project.icon] ?? ChartIcon;

  // re-light the 3D scene while the modal is open
  useEffect(() => {
    setAccent(project.accent);
    return () => setAccent(DEFAULT_ACCENT);
  }, [project, setAccent]);

  // focus management: focus panel, trap Tab, Esc closes
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusables = panelRef.current.querySelectorAll(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        style={{ '--m-accent': project.accent }}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close project details">
          <CloseIcon width={17} height={17} />
        </button>

        <div className="modal-head">
          <p className="m-index">Featured Project 0{index + 1}</p>
          <h3 id="project-modal-title">{project.name}</h3>
          <p className="m-tagline">{project.tagline}</p>
        </div>

        <div className="modal-body">
          <div>
            <p className="m-label">Overview</p>
            <p className="m-overview">{project.overview}</p>
          </div>
          <div>
            <p className="m-label">Key features</p>
            <ul className="m-features">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="m-label">Technologies</p>
            <div className="p-stack">
              {project.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          {project.repo ? (
            <a className="btn btn-ghost" href={project.repo} target="_blank" rel="noreferrer">
              <GitHubIcon width={16} height={16} /> Source
            </a>
          ) : (
            <span className="modal-note">Repository not publicly available — details per résumé.</span>
          )}
          {project.demo && (
            <a className="btn btn-ghost" href={project.demo} target="_blank" rel="noreferrer">
              <ExternalIcon /> Live demo
            </a>
          )}
          <div className="modal-nav">
            <button
              onClick={() => onNav(-1)}
              aria-label="Previous project"
            >
              ← prev
            </button>
            <button
              onClick={() => onNav(1)}
              aria-label="Next project"
            >
              next →
            </button>
          </div>
        </div>

        <span aria-hidden="true" style={{ position: 'absolute', right: '5.2rem', top: '1.4rem', color: project.accent, opacity: 0.8 }}>
          <Icon width={30} height={30} />
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const lastTrigger = useRef(null);
  const { goto } = useApp();

  const close = useCallback(() => {
    setOpen(null);
    // restore focus to the card that opened the modal
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);

  const nav = useCallback(
    (dir) => {
      setOpen((i) => (i === null ? i : (i + dir + featuredProjects.length) % featuredProjects.length));
    },
    []
  );

  return (
    <section id="projects" className="section" aria-label="Projects">
      <div className="container">
        <SectionHeading
          index="04"
          kicker="Selected work"
          title="Projects"
          note="Hover a project — the scene re-lights itself. Click for the full breakdown."
        />

        <div className="projects-grid">
          {featuredProjects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                if (el) el.dataset.index = i;
              }}
            >
              <ProjectCard
                project={p}
                index={i}
                onOpen={(idx) => {
                  lastTrigger.current = document.querySelector(
                    `#projects .projects-grid > div:nth-child(${idx + 1}) > button`
                  );
                  setOpen(idx);
                }}
              />
            </div>
          ))}
        </div>

        <Reveal delay={0.2} className="gh-all">
          <button className="btn btn-ghost" onClick={() => goto('github')} data-magnetic>
            <GitHubIcon width={16} height={16} /> More on GitHub
            <ArrowIcon width={16} height={16} className="btn-arrow" />
          </button>
        </Reveal>
      </div>

      <AnimatePresence>
        {open !== null && <ProjectModal index={open} onClose={close} onNav={nav} />}
      </AnimatePresence>
    </section>
  );
}
