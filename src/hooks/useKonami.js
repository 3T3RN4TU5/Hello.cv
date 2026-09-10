import { useEffect, useRef } from 'react';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/** Konami-code listener (case-insensitive keys, ignores typing in inputs). */
export function useKonami(onUnlock) {
  const idx = useRef(0);
  const cb = useRef(onUnlock);
  cb.current = onUnlock;

  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const expected = KONAMI[idx.current];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        idx.current += 1;
        if (idx.current === KONAMI.length) {
          idx.current = 0;
          cb.current?.();
        }
      } else {
        idx.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
