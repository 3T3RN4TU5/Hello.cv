import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../state/AppContext.jsx';

/**
 * Developer-mode HUD (easter egg #3): rendering stats + UI state.
 * Nothing sensitive — all values are visible page metadata.
 */
export default function DevMode() {
  const { setDevMode, activeSection, accent } = useApp();
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    let raf;
    const tick = (now) => {
      frames.current += 1;
      if (now - last.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        last.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dpr = window.devicePixelRatio?.toFixed(2) ?? '1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rows = [
    ['fps', fps],
    ['section', activeSection],
    ['viewport', `${window.innerWidth}×${window.innerHeight}`],
    ['dpr', dpr],
    ['accent', accent],
    ['motion', reduced ? 'reduced' : 'full'],
    ['mode', 'dev'],
  ];

  return (
    <motion.aside
      className="devhud"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Developer mode overlay"
    >
      <div className="hud-title">
        <span>dev mode</span>
        <button onClick={() => setDevMode(false)} aria-label="Close developer mode">
          ✕
        </button>
      </div>
      {rows.map(([k, v]) => (
        <div className="hud-row" key={k}>
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
    </motion.aside>
  );
}
