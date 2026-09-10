import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../state/AppContext.jsx';
import { skillNodes } from '../data/profile.js';

/**
 * Interactive skills constellation — one glowing hub per resume category,
 * tech items orbiting each hub, faint links to the central identity node.
 * Hovering a node reveals a tooltip; selecting a category dims the others.
 * Rendered only on desktop with motion allowed; touch/reduced-motion get
 * static cards instead.
 */

const HUB_RADIUS = 2.05;
const ITEM_RADIUS = 0.78;

function buildLayout() {
  return skillNodes.map((cat, ci) => {
    const angle = (ci / skillNodes.length) * Math.PI * 2 - Math.PI / 2;
    const hub = [Math.cos(angle) * HUB_RADIUS, Math.sin(angle) * HUB_RADIUS, 0];
    const items = cat.items.map((name, ii) => {
      const a = (ii / cat.items.length) * Math.PI * 2 - Math.PI / 2 + ci * 0.8;
      const jitter = ((ci + ii) % 3) * 0.14 - 0.14;
      return {
        name,
        pos: [hub[0] + Math.cos(a) * ITEM_RADIUS, hub[1] + Math.sin(a) * ITEM_RADIUS * 0.92, jitter],
      };
    });
    return { ...cat, hub, items };
  });
}

function Constellation({ selected, onSelect, reduced, hoverRef }) {
  const group = useRef();
  const layout = useMemo(buildLayout, []);
  const { accent } = useApp();
  const curAccent = useRef(new THREE.Color(accent));

  const catEdges = useMemo(
    () =>
      layout.map((cat) => {
        const pts = [];
        cat.items.forEach((it) => {
          pts.push(new THREE.Vector3(...cat.hub), new THREE.Vector3(...it.pos));
        });
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [layout]
  );

  const centerEdges = useMemo(() => {
    const pts = [];
    layout.forEach((cat) => pts.push(new THREE.Vector3(...cat.hub), new THREE.Vector3(0, 0, 0)));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [layout]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    if (!reduced && !hoverRef.current) {
      g.rotation.y = Math.sin(t * 0.22) * 0.14;
      g.rotation.x = Math.cos(t * 0.17) * 0.07;
    }
    curAccent.current.lerp(new THREE.Color(accent), 1 - Math.exp(-4 * d));
  });

  const opacityFor = (catColor) => (selected && selected !== catColor ? 0.22 : 0.95);

  return (
    <group ref={group}>
      {/* central identity node */}
      <mesh>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshBasicMaterial color={curAccent.current} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={curAccent.current} transparent opacity={0.22} />
      </mesh>

      <lineSegments geometry={centerEdges}>
        <lineBasicMaterial color="#3b4a61" transparent opacity={0.35} />
      </lineSegments>

      {layout.map((cat, ci) => (
        <group key={cat.category}>
          <lineSegments geometry={catEdges[ci]}>
            <lineBasicMaterial
              color={cat.color}
              transparent
              opacity={selected === cat.color ? 0.75 : 0.3}
            />
          </lineSegments>
          <mesh position={cat.hub}>
            <sphereGeometry args={[0.09, 18, 18]} />
            <meshBasicMaterial color={cat.color} transparent opacity={opacityFor(cat.color)} />
          </mesh>
          {cat.items.map((item) => (
            <mesh
              key={item.name}
              position={item.pos}
              onPointerOver={(e) => {
                e.stopPropagation();
                onSelect(cat.color);
                hoverRef.current = true;
                hoverRef.item = { name: item.name, category: cat.category, color: cat.color };
                hoverRef.coords = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
                document.body.setAttribute('data-cursor-hover', '');
              }}
              onPointerMove={(e) => {
                hoverRef.coords = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
              }}
              onPointerOut={() => {
                onSelect(null);
                hoverRef.current = false;
                hoverRef.item = null;
                document.body.removeAttribute('data-cursor-hover');
              }}
            >
              <sphereGeometry args={[0.052, 14, 14]} />
              <meshBasicMaterial color={cat.color} transparent opacity={opacityFor(cat.color)} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export default function SkillsConstellation({ selected, onSelect, active }) {
  const hoverRef = useRef(false);
  const hostRef = useRef(null);
  const [tip, setTip] = useState(null);

  // Convert viewport coords to container-relative + only re-render on change.
  useEffect(() => {
    let raf;
    let last = '';
    const tick = () => {
      const item = hoverRef.current && hoverRef.item ? hoverRef.item : null;
      if (item && hostRef.current && hoverRef.coords) {
        const rect = hostRef.current.getBoundingClientRect();
        const key = `${item.name}|${Math.round(hoverRef.coords.x)}|${Math.round(hoverRef.coords.y)}`;
        if (key !== last) {
          last = key;
          setTip({ ...item, x: hoverRef.coords.x - rect.left, y: hoverRef.coords.y - rect.top });
        }
      } else if (!item && last) {
        last = '';
        setTip(null);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={hostRef} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        dpr={[1, 1.75]}
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Constellation selected={selected} onSelect={onSelect} reduced={false} hoverRef={hoverRef} />
      </Canvas>
      {tip && (
        <div className="skill-tooltip" style={{ left: tip.x, top: tip.y, borderColor: `${tip.color}66` }}>
          <span className="tt-cat" style={{ color: tip.color }}>
            {tip.category}
          </span>
          {tip.name}
        </div>
      )}
    </div>
  );
}
