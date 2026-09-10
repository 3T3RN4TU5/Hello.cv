import { motion } from 'framer-motion';

/** Consistent section header: mono kicker with index + big display title. */
export default function SectionHeading({ index, kicker, title, note }) {
  return (
    <motion.header
      className="section-head"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <span className="kicker">
          {index} — {kicker}
        </span>
        <h2>{title}</h2>
      </div>
      {note && <p className="head-note">{note}</p>}
    </motion.header>
  );
}

/** Shared reveal wrapper for section content. */
export function Reveal({ children, delay = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
