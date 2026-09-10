import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { skills, skillNodes } from '../data/profile.js';
import { useIsMobile, useReducedMotion, detectWebGL } from '../hooks/useEnvironment.js';

const SkillsConstellation = lazy(() => import('../three/SkillsConstellation.jsx'));

export default function Skills() {
  const isMobile = useIsMobile(900); // constellation needs width
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(null);
  const [inView, setInView] = useState(false);
  const stageRef = useRef(null);

  const show3D = detectWebGL() && !isMobile && !reduced;

  useEffect(() => {
    if (!show3D || !stageRef.current) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' }
    );
    obs.observe(stageRef.current);
    return () => obs.disconnect();
  }, [show3D]);

  const entries = Object.entries(skills);

  return (
    <section id="skills" className="section" aria-label="Technical skills">
      <div className="container">
        <SectionHeading
          index="02"
          kicker="Tech stack"
          title="Skills"
          note="Hover the constellation — every category and technology comes straight from the résumé."
        />

        {show3D ? (
          <div className="skills-layout">
            <div className="skills-legend" role="list">
              {entries.map(([name, data], i) => (
                <Reveal key={name} delay={i * 0.07} role="listitem">
                  <button
                    className={`legend-item ${selected === data.color ? 'selected' : ''}`}
                    style={{ '--cat-color': data.color }}
                    onMouseEnter={() => setSelected(data.color)}
                    onMouseLeave={() => setSelected(null)}
                    onFocus={() => setSelected(data.color)}
                    onBlur={() => setSelected(null)}
                    aria-label={`${name}: ${data.items.join(', ')}`}
                  >
                    <span className="legend-name">
                      <span className="legend-dot" />
                      {name}
                      <span className="legend-count">{data.items.length}</span>
                    </span>
                    <span className="legend-blurb">{data.blurb}</span>
                  </button>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div
                className="skills-stage"
                ref={stageRef}
                aria-hidden="true" /* decorative twin of the legend content */
              >
                <Suspense fallback={null}>
                  {inView && (
                    <SkillsConstellation
                      selected={selected}
                      onSelect={setSelected}
                      active={inView}
                    />
                  )}
                </Suspense>
                <span className="stage-hint">hover a node · {skillNodes.reduce((n, c) => n + c.items.length, 0)} technologies</span>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="skills-static">
            {skillNodes.map((cat, i) => (
              <Reveal key={cat.category} delay={i * 0.08}>
                <div className="skill-card" style={{ '--cat-color': cat.color }}>
                  <h3>
                    <span className="legend-dot" style={{ '--cat-color': cat.color }} />
                    {cat.category}
                  </h3>
                  <p>{cat.items.join(' · ')}</p>
                  <div className="skill-chips">
                    {cat.items.map((it) => (
                      <span className="chip" key={it}>
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
