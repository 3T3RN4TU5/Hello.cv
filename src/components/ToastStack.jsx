import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../state/AppContext.jsx';

/** Bottom toast notifications (used by easter eggs & copy actions). */
export default function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.accentWord && <span className="t-accent">[{t.accentWord}] </span>}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
