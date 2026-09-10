import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../state/AppContext.jsx';
import { useIsMobile, useReducedMotion } from '../hooks/useEnvironment.js';

const BG = new THREE.Color('#05070d');

/**
 * Persistent background scene: particle starfield + procedural "identity core"
 * with orbiting shards. Decorative only (aria-hidden, pointer-events: none).
 */

/* ---------- shared scroll/pointer store (module-level, avoids re-renders) ---------- */
const input = { nx: 0, ny: 0, scroll: 0, impulse: 0 };

function useInputBindings() {
  useEffect(() => {
    const onMove = (e) => {
      input.nx = (e.clientX / window.innerWidth) * 2 - 1;
      input.ny = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      input.scroll = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
    };
    const onDown = () => {
      input.impulse = Math.min(input.impulse + 0.85, 4);
    };
    onScroll();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);
}

/* ---------- starfield ---------- */
function Starfield({ count }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cA = new THREE.Color('#8fb7ff');
    const cB = new THREE.Color('#e8eef7');
    const cC = new THREE.Color('#22d3ee');
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = -2 - Math.random() * 12;
      const c = Math.random() < 0.12 ? cC : Math.random() < 0.4 ? cA : cB;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const d = Math.min(delta, 0.05);
    pts.rotation.y += d * 0.014;
    pts.rotation.x = THREE.MathUtils.lerp(pts.rotation.x, input.ny * 0.05, 0.03);
    pts.position.x = THREE.MathUtils.lerp(pts.position.x, -input.nx * 0.6, 0.03);
    pts.position.y = THREE.MathUtils.lerp(pts.position.y, input.scroll * 3.4 - input.ny * 0.3, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- identity core ---------- */
const RING_DEFS = [
  { r: 1.5, speed: 0.55, offset: 0, tilt: [Math.PI / 2.15, 0.2, 0] },
  { r: 1.82, speed: -0.4, offset: 2.1, tilt: [Math.PI / 2.6, -0.5, 0.35] },
  { r: 2.14, speed: 0.3, offset: 4.2, tilt: [Math.PI / 1.9, 0.7, -0.3] },
];

const SHARD_DEFS = [
  { r: 2.6, speed: 0.32, size: 0.09, y: 0.4, tiltZ: 0.4 },
  { r: 3.05, speed: -0.22, size: 0.13, y: -0.7, tiltZ: -0.6 },
  { r: 2.85, speed: 0.26, size: 0.07, y: 1.1, tiltZ: 0.9 },
  { r: 3.3, speed: -0.17, size: 0.11, y: 0.1, tiltZ: -0.3 },
  { r: 2.45, speed: 0.4, size: 0.06, y: -1.3, tiltZ: 0.5 },
  { r: 3.15, speed: 0.2, size: 0.08, y: 1.6, tiltZ: -0.8 },
];

function IdentityCore({ reduced }) {
  const group = useRef();
  const shell = useRef();
  const inner = useRef();
  const rings = useRef([]);
  const nodes = useRef([]);
  const shards = useRef([]);
  const halo = useRef();
  const glow = useRef();
  const rim = useRef();

  const { accent } = useApp();
  const targetAccent = useRef(accent);
  targetAccent.current = accent;
  const cur = useRef(new THREE.Color('#4f8cff'));

  const { size } = useThree();
  const wide = size.width > 900;

  const haloData = useMemo(() => {
    const N = 240;
    const positions = new Float32Array(N * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = phi * i;
      positions[i * 3] = Math.cos(th) * r * 2.1;
      positions[i * 3 + 1] = y * 2.1;
      positions[i * 3 + 2] = Math.sin(th) * r * 2.1;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    // layout: right of the hero copy on desktop, above it on mobile
    const targetX = wide ? 2.05 : 0;
    const targetY = wide ? 0.1 : 1.15;
    const targetScale = wide ? 1 : 0.62;

    // entrance + layout easing
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 1 - Math.exp(-2.6 * d)));
    g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, 1 - Math.exp(-2.4 * d));
    const s = input.scroll;
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY + s * 3.6, 1 - Math.exp(-3 * d));

    // rotation: continuous auto-rotate + decaying click impulse
    input.impulse *= Math.exp(-1.6 * d);
    if (!reduced) {
      g.rotation.y += d * (0.22 + input.impulse * 1.1);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, input.ny * 0.18 + Math.sin(t * 0.3) * 0.04, 0.04);
      g.rotation.z = Math.sin(t * 0.22) * 0.05;
    }

    if (shell.current) {
      shell.current.rotation.y -= d * (0.3 + input.impulse * 0.8);
      shell.current.rotation.x += d * 0.08;
      const mat = shell.current.material;
      if (mat) mat.opacity = (0.5 * (1 - s) + 0.1) * (wide ? 1 : 0.7);
    }
    if (inner.current) {
      inner.current.rotation.y -= d * (0.34 + input.impulse * 0.6);
      inner.current.rotation.z += d * 0.1;
    }

    // orbiting nodes ride their rings (clearly visible motion)
    nodes.current.forEach((node, i) => {
      if (!node) return;
      const def = RING_DEFS[i];
      const a = reduced ? def.offset : t * def.speed + def.offset;
      node.position.set(Math.cos(a) * def.r, Math.sin(a) * def.r, 0);
      if (!reduced) node.scale.setScalar(1 + Math.sin(t * 2.4 + i * 2.1) * 0.25);
    });

    // floating shards
    shards.current.forEach((shard, i) => {
      if (!shard) return;
      const def = SHARD_DEFS[i];
      const a = reduced ? i * 1.3 : t * def.speed + i * 1.3;
      shard.position.set(Math.cos(a) * def.r, def.y + Math.sin(t * 0.5 + i) * 0.16, Math.sin(a) * def.r * 0.55);
      shard.rotation.x += d * 0.5;
      shard.rotation.y += d * 0.35;
    });

    if (halo.current && !reduced) {
      halo.current.rotation.y += d * 0.06;
      halo.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (glow.current && !reduced) {
      glow.current.intensity = 3.2 + Math.sin(t * 1.4) * 0.7;
    }

    // accent color transition (snap in reduced/demand mode, smooth otherwise)
    if (reduced) cur.current.set(targetAccent.current);
    else cur.current.lerp(new THREE.Color(targetAccent.current), 1 - Math.exp(-4 * d));
    if (glow.current) glow.current.color.copy(cur.current);
    if (shell.current?.material) shell.current.material.color.copy(cur.current);
    if (inner.current) inner.current.material.emissive.copy(cur.current).multiplyScalar(0.22);
    nodes.current.forEach((n) => n && n.material.color.copy(cur.current));
    shards.current.forEach((n) => n && n.material.color.copy(cur.current).lerp(new THREE.Color('#e8eef7'), 0.35));
    if (halo.current) halo.current.material.color.copy(cur.current);
  });

  return (
    <group ref={group} scale={0.001}>
      {/* wireframe shell */}
      <lineSegments ref={shell}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.62, 1)]} />
        <lineBasicMaterial color="#4f8cff" transparent opacity={0.5} depthWrite={false} />
      </lineSegments>

      {/* inner solid */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#0d1526"
          metalness={0.85}
          roughness={0.25}
          flatShading
          emissive="#4f8cff"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* orbit rings + riding nodes */}
      {RING_DEFS.map((def, i) => (
        <group key={i} rotation={def.tilt}>
          <mesh>
            <torusGeometry args={[def.r, 0.006, 8, 160]} />
            <meshBasicMaterial color="#42557a" transparent opacity={0.6} />
          </mesh>
          <mesh ref={(el) => (nodes.current[i] = el)}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#4f8cff" />
          </mesh>
        </group>
      ))}

      {/* floating shards for depth */}
      {SHARD_DEFS.map((def, i) => (
        <mesh key={i} ref={(el) => (shards.current[i] = el)} rotation={[def.tiltZ, def.tiltZ, 0]}>
          <octahedronGeometry args={[def.size, 0]} />
          <meshBasicMaterial color="#bcd3ff" transparent opacity={0.85} />
        </mesh>
      ))}

      {/* particle halo */}
      <points ref={halo}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[haloData, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#4f8cff"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* core glow + cool rim light */}
      <pointLight ref={glow} intensity={3.2} distance={9} color="#4f8cff" />
      <pointLight ref={rim} position={[-3, 2, -3]} intensity={1.6} distance={12} color="#8b5cf6" />
    </group>
  );
}

/* ---------- camera rig ---------- */
function CameraRig({ reduced }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const s = input.scroll;
    const targetX = reduced ? 0 : input.nx * 0.4;
    const targetY = reduced ? 0 : -input.ny * 0.26 - s * 1.1;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 1 - Math.exp(-3 * d));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 1 - Math.exp(-3 * d));
    camera.lookAt(0, s * 1.4, 0);
  });
  return null;
}

/* ---------- accent sync (fog follows the accent; demand-mode re-render) ---------- */
function AccentFog({ reduced }) {
  const { accent } = useApp();
  const { scene, invalidate } = useThree();
  const fog = useMemo(() => new THREE.Fog(BG.clone(), 10, 19), []);
  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);
  useEffect(() => {
    if (!reduced) return;
    fog.color.copy(BG.clone().lerp(new THREE.Color(accent), 0.16));
    invalidate();
  }, [accent, fog, reduced, invalidate]);
  useFrame((_, delta) => {
    const target = new THREE.Color(accent);
    fog.color.lerp(BG.clone().lerp(target, 0.18), 1 - Math.exp(-3 * Math.min(delta, 0.05)));
  });
  return null;
}

/* ---------- root ---------- */
export default function SceneCanvas() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  useInputBindings();

  return (
    <div className="bg-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 50 }}
        dpr={[1, isMobile ? 1.3 : 1.75]}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[-4, 5, 3]} intensity={1.2} color="#bcd3ff" />
        <directionalLight position={[5, -3, -4]} intensity={0.5} color="#22d3ee" />
        <AccentFog reduced={reduced} />
        <Starfield count={isMobile ? 420 : 1400} />
        <IdentityCore reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
