import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { AppProvider, useApp } from './state/AppContext.jsx';
import { useKonami } from './hooks/useKonami.js';
import { useReducedMotion, detectWebGL } from './hooks/useEnvironment.js';

import Preloader from './components/Preloader.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import { Education, Certifications } from './components/Education.jsx';
import GitHubSection from './components/GitHubSection.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ToastStack from './components/ToastStack.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Terminal from './components/Terminal.jsx';

const SceneCanvas = lazy(() => import('./three/SceneCanvas.jsx'));
const DevMode = lazy(() => import('./components/DevMode.jsx'));
const ConnectFour = lazy(() => import('./components/ConnectFour.jsx'));
const MatrixRain = lazy(() => import('./components/MatrixRain.jsx'));

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Magnetic hover for elements marked [data-magnetic]. */
function useMagneticEffect(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      const el = e.target.closest?.('[data-magnetic]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${dx * 7}px, ${dy * 6}px)`;
    };
    const onOut = (e) => {
      const el = e.target.closest?.('[data-magnetic]');
      if (el) el.style.transform = '';
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, [enabled]);
}

function Site() {
  const { pushToast, setTerminalOpen, devMode } = useApp();
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState(false);
  const [webgl] = useState(detectWebGL);
  const [matrix, setMatrix] = useState(false);
  const [c4Open, setC4Open] = useState(false);

  useMagneticEffect(!reduced);

  // Konami → Matrix rain (reduced motion gets a toast instead)
  useKonami(() => {
    if (reduced) {
      pushToast('Konami accepted — motion is reduced, so: a round of applause.', 'gg');
      return;
    }
    setMatrix(true);
    pushToast('Konami code accepted. Wake up…', 'gg');
  });

  // "~" / "`" toggles the hidden terminal
  useEffect(() => {
    const onKey = (e) => {
      const typing =
        e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.metaKey || e.ctrlKey;
      if (typing) return;
      if (e.key === '~' || e.key === '`') {
        e.preventDefault();
        setTerminalOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTerminalOpen]);

  // Terminal needs to be able to launch the hidden game
  const openGame = useCallback(() => setC4Open(true), []);
  const closeMatrix = useCallback(() => setMatrix(false), []);

  return (
    <>
      <AnimatePresence>{!booted && <Preloader onDone={() => setBooted(true)} reduced={reduced} />}</AnimatePresence>

      <ScrollProgress />
      <CustomCursor />

      {webgl && !reduced && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}

      <Nav />

      <main id="main">
        <Hero webgl={webgl && !reduced} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <GitHubSection />
        <Contact />
      </main>

      <Footer />

      <Terminal onPlay={openGame} />
      {devMode && (
        <Suspense fallback={null}>
          <DevMode />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <ConnectFour open={c4Open} onClose={() => setC4Open(false)} />
      </Suspense>
      {matrix && (
        <Suspense fallback={null}>
          <MatrixRain onDone={closeMatrix} />
        </Suspense>
      )}
      <ToastStack />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Site />
    </AppProvider>
  );
}
