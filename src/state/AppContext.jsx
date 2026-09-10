import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Global UI state: accent (3D lighting), toasts, terminal, dev mode,
 * active section. Small enough to not warrant a state library.
 */
const AppContext = createContext(null);

export const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
];

export function AppProvider({ children }) {
  const [accent, setAccentState] = useState('#4f8cff');
  const [toasts, setToasts] = useState([]);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const toastId = useRef(0);

  const pushToast = useCallback((text, accentWord) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, text, accentWord }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const setAccent = useCallback((hex) => {
    if (typeof hex === 'string' && /^#[0-9a-f]{6}$/i.test(hex)) setAccentState(hex);
  }, []);

  const goto = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Track the active section for nav highlight + dev HUD.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveSection(e.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const value = useMemo(
    () => ({
      accent,
      setAccent,
      toasts,
      pushToast,
      terminalOpen,
      setTerminalOpen,
      devMode,
      setDevMode,
      activeSection,
      goto,
    }),
    [accent, setAccent, toasts, pushToast, terminalOpen, devMode, activeSection, goto]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
