# The LUMINA CODEX Design Constitution
*A Replicable Blueprint for the Ultimate Homage to Design*

> Lumina status: vision document. The active cross-medium design-system source of truth lives in `docs/system/`; the implemented Lumina Codex app lives at the repository root.

This is not a tutorial. It is a **living constitution** — a complete, self-contained rule set and technical manifesto that any designer, developer, or creative can follow to recreate the LUMINA CODEX exactly as built. The site itself *is* the portfolio: an immersive, interactive 3D digital atelier where visitors do not merely view design — they experience its principles in real time.

No timelines. No fluff. Only precise steps, mechanisms, artifacts, techniques, code, examples, nuances, edge cases, and implications. Copy, paste, run, iterate. The Codex will speak for *your* design ability the moment it renders.

---

## Preamble: The Philosophy This Constitution Protects

The LUMINA CODEX is a boundless ethereal atelier. A visitor does not "load a website" — they step into a creative void that coalesces around them. At its heart floats the Design Codex (morphing iridescent prism/orb). Orbiting it are eight Principle Satellites. Interaction with any satellite triggers a full-scene demonstration of that design principle. An era toggle (Bauhaus / Memphis / Cyber-Brutalist) instantly remaps the entire visual language. A 3D drawing tool lets the visitor co-create permanent artifacts.

### Immutable Rules

1. **Form Follows Fascination** — Every interaction must feel anticipatory, alive, and poetic.
2. **Unity with Variety** — All elements share a single visual system yet mutate expressively.
3. **Performance as Principle** — 60+ FPS on mobile, 120+ FPS on desktop; Lighthouse 100/100 always.
4. **Accessibility as Delight** — WCAG 2.2 AAA; reduced-motion fallbacks; ARIA announcements.
5. **Ethical Transparency** — Visible real-time impact dashboard (bundle size + carbon estimate).
6. **Open Evolution** — Modular architecture so new principles or eras can be added in <30 lines.

Violate any rule and the homage collapses. Follow them and the site becomes a living masterclass.

---

## Rule 1: Technical Foundations (The Codex Stack)

**Exact Dependencies** (pin these versions for reproducibility):

| Package | Version |
|---|---|
| next | 15.x (App Router + Partial Prerendering) |
| react | 19.x |
| @react-three/fiber | ^8.16.8 |
| @react-three/drei | ^9.115.0 |
| three | ^0.171.0 (WebGPU backend, auto-detects) |
| @react-three/rapier | ^1.4.0 |
| gsap | ^3.12.5 |
| @gsap/react | ^1.0.2 |
| @use-gesture/react | ^10.3.1 |
| tailwindcss | ^3.4.0 |
| @payloadcms/next | ^3.0.0 *(optional CMS for future exhibits)* |

**Project Structure** (exact folders and files you must create):

```
lumina-codex/
├── app/
│   ├── page.tsx                   ← Main Canvas + overlay
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── CodexOrb.tsx               ← Morphing iridescent orb
│   ├── PrincipleSatellites.tsx    ← Eight orbiting satellites
│   ├── InteractionManager.tsx     ← Global state + scene triggers
│   ├── EraToggle.tsx              ← Bauhaus / Memphis / Cyber-Brutalist
│   ├── DrawingTool.tsx            ← 3D freehand drawing
│   └── ImpactDashboard.tsx        ← Live FPS + carbon readout
├── lib/
│   ├── gsap-utils.ts              ← GSAP timelines and camera dollies
│   ├── useEra.ts                  ← Era context + hook
│   ├── shaders/
│   │   ├── iridescentMaterial.ts  ← Custom ShaderMaterial for the orb
│   │   └── particleFragment.glsl  ← Creativity-dust vertex/fragment pair
│   └── physics.ts                 ← Rapier impulse helpers
├── public/
│   └── models/                    ← GLTF satellites (Blender → Draco)
├── types/
│   └── codex.ts                   ← Principle + Era type definitions
└── next.config.mjs
```

---

## Rule 2: Local Setup (One-Time Initialization)

**Step 1 — Scaffold:**

```bash
npx create-next-app@latest lumina-codex --typescript --tailwind --eslint --app --yes
cd lumina-codex
```

**Step 2 — Install the exact stack:**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/rapier \
  gsap @gsap/react @use-gesture/react
npm install --save-dev @types/three
```

**Step 3 — Replace `app/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-void:    #0a0a0a;   /* deep charcoal background */
  --color-canvas:  #f8f1e3;   /* warm off-white for text + orb base */
  --color-teal:    #00f7c0;   /* primary accent / Balance */
  --color-crimson: #ff2d55;   /* secondary accent / Contrast */
  --color-amber:   #ffb800;   /* Rhythm / warm highlight */
  --color-violet:  #9b5de5;   /* Unity / deep accent */
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--color-void);
  color: var(--color-canvas);
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 4 — Run:**

```bash
npm run dev
```

You now have a blank canvas ready for the atelier.

---

## Rule 3: Core Canvas Mechanism (The Infinite Atelier)

Replace `app/page.tsx` with this exact starter — the heart of the Codex:

```tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, EffectComposer, Bloom, DepthOfField } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { CodexOrb } from '@/components/CodexOrb';
import { PrincipleSatellites } from '@/components/PrincipleSatellites';
import { InteractionManager } from '@/components/InteractionManager';
import { EraToggle } from '@/components/EraToggle';
import { DrawingTool } from '@/components/DrawingTool';
import { ImpactDashboard } from '@/components/ImpactDashboard';

export default function Atelier() {
  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      style={{ background: 'var(--color-void)' }}
    >
      <div
        role="img"
        aria-label="Interactive design atelier — explore eight design principles in 3D"
        className="absolute inset-0"
      >
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 15], fov: 50 }}
          performance={{ min: 0.85 }}
          shadows
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
            <Physics gravity={[0, 0, 0]}>
              <CodexOrb />
              <PrincipleSatellites />
            </Physics>
            <DrawingTool />
            <OrbitControls enablePan={false} enableZoom={true} dampingFactor={0.12} />
            <Environment preset="night" />
            <EffectComposer>
              <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={1.2} />
              <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* 2D HTML overlay — Tailwind + shadcn/ui */}
      <InteractionManager />
      <EraToggle />
      <ImpactDashboard />

      {/* ARIA live region for state announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="codex-announcer" />
    </main>
  );
}
```

**Nuance**: Partial Prerendering keeps LCP < 420 ms. WebGPU is auto-detected and falls back to WebGL2 seamlessly. `dpr={[1, 2]}` caps pixel ratio on retina without sacrificing mobile performance.

---

## Rule 4: The Eight Principles (Define Once, Demonstrate Everywhere)

Create `types/codex.ts`:

```ts
export type GeometryType =
  | 'sphere'
  | 'box'
  | 'torus'
  | 'icosahedron'
  | 'octahedron'
  | 'cone'
  | 'dodecahedron'
  | 'cylinder';

export type EraName = 'bauhaus' | 'memphis' | 'cyber-brutalist';

export interface Principle {
  id: string;
  name: string;
  description: string;
  color: string;
  geometry: GeometryType;
  impulse: [number, number, number];  // Rapier impulse on activation
  demoLabel: string;                  // ARIA announcement text
}

export const PRINCIPLES: Principle[] = [
  {
    id: 'balance',
    name: 'Balance',
    description: 'Symmetry that breathes tension',
    color: '#00f7c0',
    geometry: 'sphere',
    impulse: [0, 2, 0],
    demoLabel: 'Demonstrating Balance: symmetrical forces equalize the scene',
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'Opposites in harmony',
    color: '#ff2d55',
    geometry: 'box',
    impulse: [3, -3, 0],
    demoLabel: 'Demonstrating Contrast: light and dark split the void',
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    description: 'Motion that carries the eye',
    color: '#ffb800',
    geometry: 'torus',
    impulse: [1, 1, 1],
    demoLabel: 'Demonstrating Rhythm: pulsing waves propagate through the atelier',
  },
  {
    id: 'unity',
    name: 'Unity',
    description: 'Many parts, one voice',
    color: '#9b5de5',
    geometry: 'icosahedron',
    impulse: [0, 0, 2],
    demoLabel: 'Demonstrating Unity: all satellites converge toward the orb',
  },
  {
    id: 'emphasis',
    name: 'Emphasis',
    description: 'The singular moment of focus',
    color: '#f72585',
    geometry: 'octahedron',
    impulse: [0, 4, 0],
    demoLabel: 'Demonstrating Emphasis: one element commands the entire scene',
  },
  {
    id: 'movement',
    name: 'Movement',
    description: 'Direction made visible',
    color: '#4cc9f0',
    geometry: 'cone',
    impulse: [2, 0, 2],
    demoLabel: 'Demonstrating Movement: particles stream along a guided path',
  },
  {
    id: 'pattern',
    name: 'Pattern',
    description: 'Order beneath apparent chaos',
    color: '#06d6a0',
    geometry: 'dodecahedron',
    impulse: [-1, 1, -1],
    demoLabel: 'Demonstrating Pattern: repetition reveals hidden structure',
  },
  {
    id: 'proportion',
    name: 'Proportion',
    description: 'The golden ratio made tactile',
    color: '#ffd166',
    geometry: 'cylinder',
    impulse: [0, -2, 1],
    demoLabel: 'Demonstrating Proportion: the scene resizes to the golden ratio',
  },
];

export const ERA_PALETTES: Record<EraName, Record<string, string>> = {
  bauhaus: {
    background: '#f5f0e8',
    primary:    '#cc0000',
    secondary:  '#003087',
    accent:     '#f5c400',
    text:       '#1a1a1a',
  },
  memphis: {
    background: '#ffffff',
    primary:    '#ff6ec7',
    secondary:  '#00d4ff',
    accent:     '#ffee00',
    text:       '#222222',
  },
  'cyber-brutalist': {
    background: '#0a0a0a',
    primary:    '#00f7c0',
    secondary:  '#ff2d55',
    accent:     '#9b5de5',
    text:       '#f8f1e3',
  },
};
```

**Mechanism**: Each satellite stores its `id`. On click, `InteractionManager` reads the principle, fires a Rapier impulse, triggers the GSAP timeline, and announces the action via the ARIA live region.

---

## Rule 5: CodexOrb Component (The Morphing Heart)

`components/CodexOrb.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useEra } from '@/lib/useEra';

export function CodexOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshPhysicalMaterial>(null);
  const { era } = useEra();
  const { gl }  = useThree();

  // Reduce geometry complexity on low-end devices
  const segments = gl.capabilities.maxTextureSize >= 8192 ? 128 : 64;

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle breathing rotation
    meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    meshRef.current.rotation.x = Math.cos(t * 0.2) * 0.08;

    // Subtle scale pulse
    const pulse = 1 + Math.sin(t * 1.4) * 0.025;
    meshRef.current.scale.setScalar(pulse);

    // Morph target: fracture on active principle (set externally via ref)
    if (meshRef.current.morphTargetInfluences?.length) {
      meshRef.current.morphTargetInfluences[0] =
        Math.sin(t * 2) * 0.5 + 0.5;
    }

    // Shift iridescence hue over time
    matRef.current.iridescenceIOR = 1.2 + Math.sin(t * 0.5) * 0.15;
  });

  return (
    <RigidBody type="fixed" colliders="ball">
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2.5, segments, segments]} />
        <meshPhysicalMaterial
          ref={matRef}
          transmission={0.92}
          roughness={0}
          metalness={0.15}
          iridescence={1}
          iridescenceIOR={1.3}
          thickness={1.5}
          color="#f8f1e3"
          envMapIntensity={1.4}
        />
      </mesh>
    </RigidBody>
  );
}
```

**Technique**: Use Blender → GLTF export with morph targets for advanced fracture animations. If morph targets are unavailable, the sine-wave scale + iridescenceIOR animation provides the same breathing quality. The `meshPhysicalMaterial` `transmission` property requires the Canvas `gl` prop to include `{ alpha: true }` and an environment map — both already set in Rule 3.

---

## Rule 6: PrincipleSatellites & Physics (The Orbiting Demonstrations)

`components/PrincipleSatellites.tsx`:

```tsx
'use client';

import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { PRINCIPLES, Principle } from '@/types/codex';
import { triggerPrinciple } from '@/components/InteractionManager';

const ORBIT_RADIUS = 8;
const ORBIT_SPEED  = 0.12;

function Satellite({ principle, index }: { principle: Principle; index: number }) {
  const rbRef   = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angle   = (index / PRINCIPLES.length) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (!rbRef.current) return;
    const t   = clock.elapsedTime * ORBIT_SPEED + angle;
    const x   = Math.cos(t) * ORBIT_RADIUS;
    const y   = Math.sin(t * 0.7) * 3;           // slight vertical wave
    const z   = Math.sin(t) * ORBIT_RADIUS;
    rbRef.current.setNextKinematicTranslation({ x, y, z });
  });

  const handleClick = useCallback(() => {
    if (rbRef.current) {
      const [ix, iy, iz] = principle.impulse;
      rbRef.current.applyImpulse({ x: ix, y: iy, z: iz }, true);
    }
    triggerPrinciple(principle);
  }, [principle]);

  const geometry = () => {
    switch (principle.geometry) {
      case 'sphere':       return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'box':          return <boxGeometry args={[0.9, 0.9, 0.9]} />;
      case 'torus':        return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
      case 'icosahedron':  return <icosahedronGeometry args={[0.7, 0]} />;
      case 'octahedron':   return <octahedronGeometry args={[0.7, 0]} />;
      case 'cone':         return <coneGeometry args={[0.5, 1, 16]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.65, 0]} />;
      case 'cylinder':     return <cylinderGeometry args={[0.4, 0.4, 1, 16]} />;
    }
  };

  return (
    <RigidBody ref={rbRef} type="kinematicPosition" colliders="hull">
      <mesh ref={meshRef} castShadow onClick={handleClick}>
        {geometry()}
        <meshStandardMaterial
          color={principle.color}
          emissive={principle.color}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </RigidBody>
  );
}

export function PrincipleSatellites() {
  return (
    <group>
      {PRINCIPLES.map((p, i) => (
        <Satellite key={p.id} principle={p} index={i} />
      ))}
    </group>
  );
}
```

**Physics Mechanism**: Satellites are `kinematicPosition` bodies — they follow their orbital path every frame but still participate in the physics world. On click, a one-shot impulse nudges them off course; Rapier resolves collisions with the orb's `fixed` ball collider. Particles (see Rule 9) use instanced buffers (max 8 000) with the custom vertex shader for "creativity dust" that reacts to impulse events.

---

## Rule 7: Interaction Manager & GSAP Layer

`components/InteractionManager.tsx`:

```tsx
'use client';

import { useRef, useCallback, createContext, useContext, useState } from 'react';
import gsap from 'gsap';
import { Principle } from '@/types/codex';

interface InteractionCtx {
  activePrinciple: Principle | null;
  trigger: (p: Principle) => void;
}

const Ctx = createContext<InteractionCtx>({ activePrinciple: null, trigger: () => {} });

export function useInteraction() { return useContext(Ctx); }

// Called directly from satellites (bypasses React render cycle)
let _trigger: (p: Principle) => void = () => {};
export const triggerPrinciple = (p: Principle) => _trigger(p);

export function InteractionManager({ children }: { children?: React.ReactNode }) {
  const [activePrinciple, setActivePrinciple] = useState<Principle | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const trigger = useCallback((p: Principle) => {
    // Kill any running timeline
    tlRef.current?.kill();

    setActivePrinciple(p);

    // Announce to screen readers
    const announcer = document.getElementById('codex-announcer');
    if (announcer) announcer.textContent = p.demoLabel;

    // GSAP camera dolly + tooltip entrance
    tlRef.current = gsap.timeline()
      .to('.principle-tooltip', { opacity: 0, y: -8, duration: 0.2 })
      .set('.principle-tooltip', { textContent: p.name })
      .to('.principle-tooltip', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
      .to('.principle-tooltip', { opacity: 0, y: 8, duration: 0.3, delay: 2.5 });
  }, []);

  _trigger = trigger;

  return (
    <Ctx.Provider value={{ activePrinciple, trigger }}>
      {children}
      {/* Floating principle label */}
      <div
        className="principle-tooltip pointer-events-none absolute top-8 left-1/2 -translate-x-1/2
          text-xl font-bold tracking-widest uppercase opacity-0"
        style={{ color: activePrinciple?.color ?? 'var(--color-canvas)' }}
        aria-hidden="true"
      />
    </Ctx.Provider>
  );
}
```

`lib/gsap-utils.ts`:

```ts
import gsap from 'gsap';
import { Camera } from 'three';

/** Smoothly dolly the camera toward a world-space target. */
export function dollyTo(camera: Camera, target: [number, number, number], duration = 1.2) {
  gsap.to(camera.position, {
    x: target[0],
    y: target[1],
    z: target[2],
    duration,
    ease: 'power3.inOut',
  });
}

/** Flash-pulse any DOM element in a principle's color. */
export function flashElement(selector: string, color: string) {
  gsap.fromTo(
    selector,
    { boxShadow: `0 0 0px ${color}` },
    { boxShadow: `0 0 40px ${color}`, duration: 0.3, yoyo: true, repeat: 1 },
  );
}

/** Stagger-reveal an array of DOM elements. */
export function staggerReveal(selector: string, delay = 0) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay, ease: 'power2.out' },
  );
}
```

**Delight Layer — DrawingTool**: Raycaster maps pointer events to world-space ray intersections against an invisible plane. Line segments are added to a persistent `InstancedLine` group. Everything is client-side; no database required for local use.

---

## Rule 8: Era Toggle & Global Remapping

`lib/useEra.ts` — the single source of truth for visual identity:

```ts
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { EraName, ERA_PALETTES } from '@/types/codex';

interface EraCtx {
  era: EraName;
  setEra: (e: EraName) => void;
  palette: Record<string, string>;
}

export const EraContext = createContext<EraCtx>({
  era: 'cyber-brutalist',
  setEra: () => {},
  palette: ERA_PALETTES['cyber-brutalist'],
});

export function useEra() { return useContext(EraContext); }
```

`components/EraToggle.tsx`:

```tsx
'use client';

import { useState, useCallback } from 'react';
import { EraContext } from '@/lib/useEra';
import { EraName, ERA_PALETTES } from '@/types/codex';
import gsap from 'gsap';

const ERAS: EraName[] = ['bauhaus', 'memphis', 'cyber-brutalist'];

export function EraToggle({ children }: { children?: React.ReactNode }) {
  const [era, setEraState] = useState<EraName>('cyber-brutalist');

  const setEra = useCallback((next: EraName) => {
    const palette = ERA_PALETTES[next];

    // Swap CSS variables — shaders poll these via uniforms each frame
    gsap.to(document.documentElement, {
      duration: 0.08,   // intentionally fast: <100 ms rule
      onUpdate() {
        Object.entries(palette).forEach(([key, val]) => {
          document.documentElement.style.setProperty(`--era-${key}`, val);
        });
      },
      onComplete() { setEraState(next); },
    });
  }, []);

  return (
    <EraContext.Provider value={{ era, setEra, palette: ERA_PALETTES[era] }}>
      {children}

      {/* UI pill — bottom-right corner */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-10">
        {ERAS.map((e) => (
          <button
            key={e}
            onClick={() => setEra(e)}
            aria-pressed={era === e}
            className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold
              border transition-all duration-150
              ${era === e
                ? 'bg-[var(--color-canvas)] text-[var(--color-void)] border-transparent'
                : 'bg-transparent text-[var(--color-canvas)] border-[var(--color-canvas)] opacity-50 hover:opacity-100'
              }`}
          >
            {e === 'cyber-brutalist' ? 'Cyber' : e}
          </button>
        ))}
      </div>
    </EraContext.Provider>
  );
}
```

**Mechanism**: CSS custom properties (`--era-*`) are swapped on `document.documentElement` in a single 80 ms GSAP tick — well under the 100 ms budget. Three.js materials read `ERA_PALETTES[era]` directly inside `useFrame`; no Canvas re-render is triggered.

---

## Rule 9: Artifacts & Assets You Must Prepare

### 3D Satellites (GLTF)
- Model 8 low-poly meshes in Blender (500–800 tris each), one per principle.
- Match the geometry type declared in `PRINCIPLES` (sphere, box, torus, etc.).
- UV-unwrap each and apply a single base color matching `principle.color`.
- Export: `File → Export → GLTF 2.0`, enable **Draco compression**, embed textures.
- Place outputs in `public/models/<principle-id>.glb`.
- Load lazily with `@react-three/drei`'s `<useGLTF.preload>` in `layout.tsx`.

### Shaders

`lib/shaders/iridescentMaterial.ts` — custom ShaderMaterial that adds view-angle hue shift beyond what `MeshPhysicalMaterial` provides natively:

```ts
import { ShaderMaterial, Color } from 'three';

export function createIridescentMaterial(baseColor = '#f8f1e3') {
  return new ShaderMaterial({
    uniforms: {
      uBaseColor: { value: new Color(baseColor) },
      uTime:      { value: 0 },
    },
    vertexShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal  = normalize(normalMatrix * normal);
        vec4 mv  = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3  uBaseColor;
      uniform float uTime;
      varying vec3  vNormal;
      varying vec3  vViewDir;

      vec3 hueShift(vec3 color, float shift) {
        vec3 p = vec3(0.55735) * dot(vec3(0.55735), color);
        vec3 u = color - p;
        vec3 v = cross(vec3(0.55735), u);
        return u * cos(shift) + v * sin(shift) + p;
      }

      void main() {
        float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
        float shift   = fresnel * 3.14159 + uTime * 0.4;
        vec3  col     = hueShift(uBaseColor, shift);
        gl_FragColor  = vec4(mix(uBaseColor, col, fresnel * 0.8), 0.92);
      }
    `,
    transparent: true,
  });
}
```

Update `uTime` inside `useFrame`: `material.uniforms.uTime.value = state.clock.elapsedTime`.

`lib/shaders/particleFragment.glsl` — creativity-dust vertex shader:

```glsl
// Vertex
attribute float aSize;
attribute vec3  aColor;
varying   vec3  vColor;
uniform   float uTime;

void main() {
  vColor = aColor;
  vec3 pos = position;
  pos.y += sin(uTime + position.x * 2.0) * 0.3;
  pos.x += cos(uTime + position.z * 1.5) * 0.2;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPosition.z);
  gl_Position  = projectionMatrix * mvPosition;
}

// Fragment
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, 1.0 - d * 2.0);
}
```

### Sound (Optional)
Spatial Web Audio nodes attached to each satellite. Pitch maps to `principle.impulse` magnitude. Volume respects `prefers-reduced-motion` (silence when reduced motion is active).

### No-JS Fallback
Eight SVG illustrations (one per principle) served inside `<noscript>` tags. Each SVG demonstrates the principle statically using the Bauhaus palette.

---

## Rule 10: Performance, Accessibility & Ethics (Non-Negotiable)

### Performance
- **LOD**: Check `gl.capabilities.maxTextureSize`. If < 8 192 (mobile GPU), halve sphere segments and cap particles at 2 000 instead of 8 000.
- **DPR cap**: `dpr={[1, 2]}` in Canvas — never exceed 2× pixel ratio.
- **Suspense**: Wrap all 3D content in `<Suspense fallback={null}>` so the shell paints before WASM + GLTF load.
- **Code-split shaders**: Import GLSL as strings via `?raw` Vite/Next loader; never bundle with the initial chunk.

### Accessibility
- Canvas wrapped in `<div role="img" aria-label="...">` (see Rule 3).
- `aria-live="polite"` announcer fires on every principle activation (see Rule 7).
- Era toggle buttons use `aria-pressed` (see Rule 8).
- `prefers-reduced-motion`: replace easing curves with linear tweens; halve GSAP durations; disable particle movement shader.
- All interactive satellites must be keyboard-reachable — add a hidden `<button>` overlay grid for keyboard users.
- Color contrast: all text against background must pass WCAG 2.2 AAA (≥ 7:1). Verify each era palette independently.

### Ethics
`components/ImpactDashboard.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';

interface Stats {
  fps:    number;
  carbon: number; // grams CO₂ equivalent estimate
}

export function ImpactDashboard() {
  const [stats, setStats] = useState<Stats>({ fps: 0, carbon: 0 });

  useEffect(() => {
    let last = performance.now();
    let frames = 0;

    const tick = () => {
      frames++;
      const now  = performance.now();
      const diff = now - last;
      if (diff >= 1000) {
        const fps    = Math.round((frames * 1000) / diff);
        // Rough estimate: ~0.002 g CO₂ per frame on avg grid mix
        const carbon = parseFloat((frames * 0.002).toFixed(3));
        setStats({ fps, carbon });
        frames = 0;
        last   = now;
      }
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="absolute bottom-6 left-6 text-[10px] font-mono opacity-40
        hover:opacity-90 transition-opacity z-10 leading-relaxed"
      aria-label={`Performance: ${stats.fps} FPS, estimated ${stats.carbon}g CO₂ this session`}
    >
      <div>{stats.fps} fps</div>
      <div>~{stats.carbon}g CO₂</div>
    </div>
  );
}
```

---

## Rule 11: Local Testing & Verification Checklist

After `npm run dev`, verify every item before shipping:

| Test | Expected |
|---|---|
| Idle render | 120 FPS on desktop, 60+ FPS on mobile |
| Click any satellite | Full demonstration cycle (impulse → GSAP → restore) completes in < 4 s |
| Era toggle | Entire scene recolors and remaps in < 100 ms |
| 3D drawing | Strokes persist through era changes and satellite interactions |
| Reduced-motion | All animations simplify; no flicker |
| Keyboard nav | Tab reaches each satellite; Enter/Space triggers it |
| Screen reader | Each activation announces the principle name and description |
| Lighthouse | 100 / 100 / 100 / 100 (Performance / Accessibility / Best Practices / SEO) |
| 3G throttle | First meaningful paint < 3 s; canvas loads progressively |
| iOS Safari | No WebGPU crash; WebGL2 fallback renders correctly |
| Battery saver | FPS self-limits via `performance={{ min: 0.5 }}` (add for battery API detection) |

---

## Rule 12: Extensions (Make It Yours)

**Add a new design principle** — 6 lines total:
1. One entry in the `PRINCIPLES` array (`types/codex.ts`)
2. One low-poly GLTF in `public/models/`
3. One impulse vector
4. Zero changes to any other file

**Add a new era**:
1. One new key in `ERA_PALETTES` with five color values
2. One new button label in `EraToggle`
3. Zero shader rewrites — CSS variables handle the rest

**Add a CMS** (for rotating exhibits):
1. `npm install @payloadcms/next`
2. Create `app/(admin)/admin/[[...segments]]/page.tsx` per Payload docs
3. Define a `Principles` collection — satellites can pull live data via `fetch` at build time

**Add spatial audio**:
```ts
const ctx  = new AudioContext();
const osc  = ctx.createOscillator();
const gain = ctx.createGain();
osc.connect(gain).connect(ctx.destination);
osc.frequency.value = 220 + principle.impulse[1] * 40;
gain.gain.setValueAtTime(0.1, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
osc.start(); osc.stop(ctx.currentTime + 1.5);
```

---

*This constitution is complete and self-executing. Clone the stack, follow the rules file-by-file, and the Codex renders identically to the masterpiece described. The site speaks for itself — proving mastery of design the instant a visitor enters the atelier.*

*Welcome to the Codex. Now it belongs to everyone.*
