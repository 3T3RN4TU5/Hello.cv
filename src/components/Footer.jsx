import { useApp } from '../state/AppContext.jsx';
import { TerminalIcon } from './icons.jsx';
import { profile } from '../data/profile.js';

export default function Footer() {
  const { setTerminalOpen, pushToast } = useApp();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name} · Built with React, Three.js & Framer Motion
        </span>
        <span className="f-hint" aria-hidden="true">
          psst — press <kbd>~</kbd> or try the Konami code
        </span>
        <button
          className="terminal-launch"
          onClick={() => {
            setTerminalOpen(true);
            pushToast('Developer terminal opened', 'terminal');
          }}
          aria-label="Open developer terminal"
          title="Developer terminal"
        >
          <TerminalIcon width={16} height={16} />
        </button>
      </div>
    </footer>
  );
}
