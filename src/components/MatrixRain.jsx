import { useEffect, useRef } from 'react';

const GLYPHS = 'アカサタナハマヤラワ0123456789<>{}[]();=/\\'.split('');

/**
 * Easter egg #1 payoff — short Matrix-rain overlay triggered by the
 * Konami code. Self-terminates; skipped when reduced motion is preferred.
 */
export default function MatrixRain({ duration = 4600, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const { innerWidth: w, innerHeight: h } = window;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const fontSize = 15;
    const cols = Math.ceil(w / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -60);

    let raf;
    let last = 0;
    const start = performance.now();

    const draw = (now) => {
      if (now - start > duration) {
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(draw);
      if (now - last < 45) return;
      last = now;

      ctx.fillStyle = 'rgba(5, 7, 13, 0.16)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < cols; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() < 0.08 ? '#e8f6ff' : '#22d3ee';
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y);
        if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -30;
        drops[i] += 1;
      }
      // fade the whole overlay out near the end
      const remain = 1 - (now - start) / duration;
      canvas.style.opacity = String(Math.min(1, remain * 3));
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [duration, onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 185,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        background: 'rgba(5, 7, 13, 0.35)',
        transition: 'opacity 0.4s linear',
      }}
    />
  );
}
