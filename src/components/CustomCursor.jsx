import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useEnvironment.js';

/**
 * Custom cursor + micro-interactions (easter egg #5):
 *  - ring grows over interactive elements
 *  - click spawns a short particle burst
 *  - holding the mouse (>650ms) reveals a rotating factual caption
 * Auto-disabled on touch devices and reduced motion.
 */
const HOLD_CAPTIONS = [
  'MCA graduate — CGPA 7.89',
  'MERN stack, end to end',
  'Winner — MEDHA-23 coding event',
  'Power BI Gold certified (NASSCOM)',
  'try: press ~ for a terminal',
  'try: ↑ ↑ ↓ ↓ ← → ← → B A',
  'Python · Pandas · Scikit-Learn',
];

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const captionRef = useRef(null);
  const captionIdx = useRef(Math.floor(Math.random() * HOLD_CAPTIONS.length));
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || reduced) return undefined;
    setEnabled(true);
    document.body.classList.add('cursor-enabled');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const caption = captionRef.current;
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let raf;
    let hoverCount = 0;
    let holdTimer = null;
    let burstCount = 0;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.opacity = ring.style.opacity = '1';
      const interactive = e.target.closest?.('a, button, [role="button"], input, [data-cursor-hover]');
      ring.classList.toggle('hovering', Boolean(interactive));
    };

    const burst = (x, y) => {
      if (burstCount > 14) return; // cap concurrent particles
      for (let i = 0; i < 6; i++) {
        const p = document.createElement('span');
        p.className = 'cursor-burst';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        document.body.appendChild(p);
        burstCount += 1;
        const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
        const dist = 26 + Math.random() * 26;
        p.animate(
          [
            { transform: 'translate(-50%,-50%)', opacity: 1 },
            {
              transform: `translate(${Math.cos(angle) * dist - 3}px, ${Math.sin(angle) * dist - 3}px) scale(0.2)`,
              opacity: 0,
            },
          ],
          { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }
        ).onfinish = () => {
          p.remove();
          burstCount -= 1;
        };
      }
    };

    const onDown = (e) => {
      if (e.button !== 0) return;
      burst(e.clientX, e.clientY);
      // hold-to-reveal caption
      holdTimer = setTimeout(() => {
        captionIdx.current = (captionIdx.current + 1) % HOLD_CAPTIONS.length;
        caption.textContent = HOLD_CAPTIONS[captionIdx.current];
        caption.style.left = `${e.clientX}px`;
        caption.style.top = `${e.clientY}px`;
        caption.style.opacity = '1';
      }, 650);
    };

    const cancelHold = () => {
      clearTimeout(holdTimer);
      if (caption) caption.style.opacity = '0';
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', cancelHold);
    window.addEventListener('pointercancel', cancelHold);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('cursor-enabled');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', cancelHold);
      window.removeEventListener('pointercancel', cancelHold);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div
        ref={captionRef}
        className="cursor-caption"
        aria-hidden="true"
        style={{ opacity: 0, transition: 'opacity .35s var(--ease)' }}
      />
    </>
  );
}
