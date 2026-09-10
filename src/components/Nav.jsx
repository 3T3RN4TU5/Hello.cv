import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SECTIONS, useApp } from '../state/AppContext.jsx';
import { DownloadIcon } from './icons.jsx';
import { profile } from '../data/profile.js';

const NAV_IDS = SECTIONS.slice(1, 7); // about … github

export default function Nav() {
  const { activeSection, goto } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  const jump = (id) => {
    setOpen(false);
    goto(id);
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <button
            className="nav-logo"
            onClick={() => jump('hero')}
            aria-label="Jeevan — back to top"
            data-magnetic
          >
            <span className="logo-mark">J</span>
            <span>jeevan</span>
          </button>

          <nav className="nav-links" aria-label="Primary">
            {NAV_IDS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  jump(id);
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-cta">
            <a
              className="btn btn-ghost btn-resume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              style={{ padding: '0.55em 1.2em', fontSize: '0.85rem' }}
            >
              <DownloadIcon width={15} height={15} /> Résumé
            </a>
            <button
              className="nav-burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile">
              <ul>
                {SECTIONS.slice(1).map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        jump(id);
                      }}
                    >
                      <span className="menu-index">0{i + 1}</span>
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
