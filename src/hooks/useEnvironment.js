import { useEffect, useState } from 'react';

/** Reactive prefers-reduced-motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Coarse-pointer / touch device detection. */
export function useIsMobile(breakpoint = 720) {
  const [mobile, setMobile] = useState(() => window.innerWidth <= breakpoint);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return mobile;
}

/** WebGL support probe (context creation test). */
export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}
