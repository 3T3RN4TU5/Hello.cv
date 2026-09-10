import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp, SECTIONS } from '../state/AppContext.jsx';
import {
  profile,
  skills,
  experience,
  education,
  certifications,
  internships,
} from '../data/profile.js';
import { featuredProjects } from '../data/projects.js';

const BANNER = [
  'Jeevan Portfolio Shell — interactive résumé terminal',
  "type 'help' for available commands",
];

/**
 * Hidden developer terminal. Every response is rendered from the same
 * verified data the site uses — no invented content.
 */
export default function Terminal({ onPlay }) {
  const { terminalOpen, setTerminalOpen, goto, setDevMode, devMode, pushToast } = useApp();
  const [history, setHistory] = useState(() =>
    BANNER.map((line, i) => ({ type: i === 0 ? 'accent' : 'dim', text: line }))
  );
  const [value, setValue] = useState('');
  const [histIndex, setHistIndex] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const cmdHistory = useRef([]);

  useEffect(() => {
    if (terminalOpen) inputRef.current?.focus();
  }, [terminalOpen]);

  // keep the newest output in view after every command
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history]);

  const print = (lines) =>
    setHistory((h) => [...h, ...lines.map((l) => (typeof l === 'string' ? { type: 'out', text: l } : l))]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    cmdHistory.current.unshift(cmd);
    setHistIndex(-1);
    print([{ type: 'cmd', text: `jeevan@portfolio:~$ ${cmd}` }]);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    switch (name) {
      case 'help':
        print([
          { type: 'accent', text: 'available commands' },
          '  help          this list',
          '  whoami        who is this portfolio about',
          '  about         professional summary',
          '  skills        technical skills by category',
          '  projects      featured projects',
          '  experience    work experience & internships',
          '  education     academic history',
          '  certs         certifications & achievements',
          '  contact       ways to reach me',
          '  github        open the GitHub profile',
          '  goto <section>  scroll to a section',
          '  dev           toggle developer mode HUD',
          '  play          hidden game (a real repo…)',
          '  clear         clear terminal',
          '  exit          close terminal',
        ]);
        break;
      case 'whoami':
        print([`${profile.name} — ${profile.title}, ${profile.suffix}`]);
        break;
      case 'about':
        print([profile.summary]);
        break;
      case 'skills':
        print(
          Object.entries(skills).flatMap(([cat, data]) => [
            { type: 'accent', text: `${cat}:` },
            `  ${data.items.join(', ')}`,
          ])
        );
        break;
      case 'projects':
        print(
          featuredProjects.flatMap((p, i) => [
            { type: 'accent', text: `[0${i + 1}] ${p.name} — ${p.tagline}` },
            `  stack: ${p.stack.join(', ')}`,
          ])
        );
        break;
      case 'experience':
        print(
          experience.flatMap((job) => [
            { type: 'accent', text: `${job.role} · ${job.org} (${job.period})` },
            ...(job.client ? [`  ${job.client}`] : []),
          ]).concat([{ type: 'dim', text: 'internships: ' + internships.map((i) => i.org).join(' · ') }])
        );
        break;
      case 'education':
        print(
          education.map((e) => `${e.degree} — ${e.institution} · ${e.score} · ${e.period}`)
        );
        break;
      case 'certs':
      case 'certifications':
        print(certifications.map((c) => `${c.title} — ${c.detail}`));
        break;
      case 'contact':
        print([
          { type: 'accent', text: 'email     ' + profile.email },
          { type: 'accent', text: 'phone     ' + profile.phone },
          { type: 'accent', text: 'github    ' + profile.github },
          { type: 'accent', text: 'linkedin  ' + profile.linkedin },
        ]);
        break;
      case 'github':
        print([{ type: 'dim', text: 'opening GitHub profile…' }]);
        window.open(profile.github, '_blank', 'noopener');
        break;
      case 'goto': {
        const target = SECTIONS.find(
          (s) => s.id === args[0] || s.label.toLowerCase() === args.join(' ')
        );
        if (target) {
          print([{ type: 'dim', text: `scrolling to #${target.id}…` }]);
          goto(target.id);
        } else {
          print([{ type: 'dim', text: `unknown section. try: ${SECTIONS.map((s) => s.id).join(', ')}` }]);
        }
        break;
      }
      case 'dev':
        setDevMode(!devMode);
        print([{ type: 'dim', text: `developer mode ${!devMode ? 'enabled' : 'disabled'}` }]);
        break;
      case 'play':
        print([{ type: 'dim', text: 'loading hidden project…' }]);
        setTerminalOpen(false);
        onPlay();
        break;
      case 'sudo':
        print([{ type: 'dim', text: 'nice try — no root on a portfolio.' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
      case 'quit':
        setTerminalOpen(false);
        break;
      case 'coffee':
        print([{ type: 'dim', text: '☕ brewing… productivity +10%' }]);
        break;
      default:
        print([
          { type: 'dim', text: `command not found: ${name} — try 'help'` },
        ]);
        pushToast(`Unknown command: ${name}`);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(value);
      setValue('');
    } else if (e.key === 'Escape') {
      setTerminalOpen(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIndex + 1, cmdHistory.current.length - 1);
      if (cmdHistory.current[next]) {
        setHistIndex(next);
        setValue(cmdHistory.current[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIndex - 1;
      setHistIndex(next);
      setValue(next >= 0 ? cmdHistory.current[next] ?? '' : '');
    }
  };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          className="terminal"
          role="dialog"
          aria-label="Developer terminal"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="term-head">
            <span className="term-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>jeevan@portfolio: ~</span>
            <button className="term-close" onClick={() => setTerminalOpen(false)} aria-label="Close terminal">
              ✕
            </button>
          </div>
          <div className="term-body" ref={bodyRef} aria-live="polite">
            {history.map((line, i) => (
              <div key={i} className={`term-line ${line.type}`}>
                {line.type === 'cmd' ? line.text.replace('jeevan@portfolio:~$ ', '') : line.text}
              </div>
            ))}
          </div>
          <div className="term-input-row">
            <label htmlFor="term-input" className="t-prompt">
              jeevan@portfolio:~$
            </label>
            <input
              id="term-input"
              ref={inputRef}
              className="term-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
