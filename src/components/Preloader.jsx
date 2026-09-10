import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Short branded preloader — progress is time-based (assets are tiny),
 * capped at ~1.1s so it never blocks navigation. Skipped entirely when
 * the user prefers reduced motion.
 */
export default function Preloader({ onDone, reduced }) {
  const [progress, setProgress] = useState(reduced ? 100 : 0);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 80);
      return () => clearTimeout(t);
    }
    const start = performance.now();
    const DURATION = 1050;
    let raf;
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / DURATION) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduced]);

  return (
    <motion.div
      className="preloader"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <div className="pre-inner">
        <span className="pre-mark">J.</span>
        <div className="pre-track">
          <div className="pre-fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <span className="pre-label">Initialising portfolio</span>
      </div>
    </motion.div>
  );
}
