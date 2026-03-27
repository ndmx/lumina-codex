"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Line,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { memo, useEffect, useMemo, useRef } from "react";
import type {
  Group,
  Mesh,
  PerspectiveCamera as PerspectiveCameraType,
  MeshBasicMaterial as MeshBasicMaterialType,
  ShaderMaterialParameters,
  Vector3Tuple,
} from "three";
import * as THREE from "three";
import type { EraKey } from "@/components/codex-content";

type PointerState = {
  x: number;
  y: number;
};

type SceneMode = "preview" | "theater";

type CodexSceneProps = {
  activePrincipleKey: string;
  balanceCycle: number;
  transitionCycle: number;
  era: EraKey;
  liteMode: boolean;
  pointer: PointerState;
  scrollProgress: number;
  sceneMode: SceneMode;
  chapterOverlayOpen: boolean;
};

type Palette = {
  background: string;
  primary: string;
  secondary: string;
  tertiary: string;
  sparkles: string;
  ambient: string;
  fog: string;
};

type AuraMaterialImpl = THREE.ShaderMaterial & {
  uniforms: {
    uTime: { value: number };
    uPrimary: { value: THREE.Color };
    uSecondary: { value: THREE.Color };
    uScroll: { value: number };
    uPulse: { value: number };
  };
};

type BackdropMaterialImpl = THREE.ShaderMaterial & {
  uniforms: {
    uTime: { value: number };
    uPrimary: { value: THREE.Color };
    uSecondary: { value: THREE.Color };
    uTertiary: { value: THREE.Color };
    uScroll: { value: number };
    uFocus: { value: number };
  };
};

const auraVertexShader = [
  "varying vec3 vNormal;",
  "varying vec3 vWorldPosition;",
  "void main() {",
  "  vNormal = normalize(normalMatrix * normal);",
  "  vec4 worldPosition = modelMatrix * vec4(position, 1.0);",
  "  vWorldPosition = worldPosition.xyz;",
  "  gl_Position = projectionMatrix * viewMatrix * worldPosition;",
  "}",
].join("\n");

const auraFragmentShader = [
  "uniform float uTime;",
  "uniform vec3 uPrimary;",
  "uniform vec3 uSecondary;",
  "uniform float uScroll;",
  "uniform float uPulse;",
  "varying vec3 vNormal;",
  "varying vec3 vWorldPosition;",
  "void main() {",
  "  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.4);",
  "  float wave = sin(uTime * 1.9 + vWorldPosition.y * 3.2 + vWorldPosition.x * 2.6) * 0.5 + 0.5;",
  "  float bands = sin(vWorldPosition.y * 6.0 - uTime * 1.4) * 0.5 + 0.5;",
  "  vec3 color = mix(uPrimary, uSecondary, wave * 0.55 + bands * 0.2);",
  "  float alpha = fresnel * (0.28 + uScroll * 0.35 + uPulse * 0.3);",
  "  alpha += wave * 0.08;",
  "  gl_FragColor = vec4(color, alpha);",
  "}",
].join("\n");

const backdropVertexShader = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const backdropFragmentShader = [
  "uniform float uTime;",
  "uniform vec3 uPrimary;",
  "uniform vec3 uSecondary;",
  "uniform vec3 uTertiary;",
  "uniform float uScroll;",
  "uniform float uFocus;",
  "varying vec2 vUv;",
  "void main() {",
  "  vec2 uv = vUv * 2.0 - 1.0;",
  "  uv.y *= 0.86;",
  "  float radial = 1.0 - smoothstep(0.0, 1.2, length(uv));",
  "  float waves = sin((uv.x + uTime * 0.08) * 8.0) * cos((uv.y - uTime * 0.06) * 10.0);",
  "  float ribbons = sin(uv.y * 13.0 - uTime * 1.4 + uv.x * 5.5) * 0.5 + 0.5;",
  "  float diagonal = sin((uv.x + uv.y) * 8.0 + uTime * 0.9) * 0.5 + 0.5;",
  "  vec3 base = mix(uSecondary, uPrimary, ribbons);",
  "  vec3 color = mix(base, uTertiary, diagonal * 0.22 + uFocus * 0.3);",
  "  float glow = radial * (0.26 + uScroll * 0.38 + uFocus * 0.22);",
  "  glow += waves * 0.06 * radial;",
  "  gl_FragColor = vec4(color, max(glow, 0.0));",
  "}",
].join("\n");

const palettes: Record<EraKey, Palette> = {
  atelier: {
    background: "#06070a",
    primary: "#79f3df",
    secondary: "#ff8d74",
    tertiary: "#f4ecdd",
    sparkles: "#c7fff4",
    ambient: "#fff0df",
    fog: "#120e11",
  },
  memphis: {
    background: "#100816",
    primary: "#6fffd8",
    secondary: "#ff6ec7",
    tertiary: "#ffe066",
    sparkles: "#fff2a8",
    ambient: "#ffe6ff",
    fog: "#180a19",
  },
  brutalist: {
    background: "#04070d",
    primary: "#7be8ff",
    secondary: "#ff735a",
    tertiary: "#d8e3ff",
    sparkles: "#99f7ff",
    ambient: "#dbe6ff",
    fog: "#090d15",
  },
};

const activeOffsets: Record<string, number> = {
  balance: 0,
  contrast: 0.35,
  rhythm: 0.7,
  unity: 1.05,
};

const focusStrengths: Record<string, number> = {
  balance: 0.95,
  contrast: 1.2,
  rhythm: 1.05,
  unity: 0.88,
};

const satellites: {
  key: string;
  position: Vector3Tuple;
  scale: number;
  geometry: "sphere" | "torus" | "box" | "octahedron";
}[] = [
  { key: "balance", position: [-2.6, 1.65, 1.1], scale: 0.7, geometry: "sphere" },
  { key: "contrast", position: [2.7, 1.9, 0.4], scale: 0.76, geometry: "torus" },
  { key: "rhythm", position: [2.45, -1.85, 0.9], scale: 0.68, geometry: "box" },
  { key: "unity", position: [-2.2, -1.9, -0.15], scale: 0.88, geometry: "octahedron" },
];

function useBalanceStart(activePrincipleKey: string, balanceCycle: number) {
  const startRef = useRef(0);

  useEffect(() => {
    if (activePrincipleKey === "balance") {
      startRef.current = performance.now() / 1000;
    }
  }, [activePrincipleKey, balanceCycle]);

  return startRef;
}

function getBalanceEnvelope(now: number, startTime: number) {
  if (startTime === 0) {
    return 0;
  }

  const duration = 2.8;
  const elapsed = now - startTime;

  if (elapsed < 0 || elapsed > duration) {
    return 0;
  }

  const progress = elapsed / duration;
  return Math.sin(progress * Math.PI);
}

function useTransitionStart(transitionCycle: number) {
  const startRef = useRef(0);

  useEffect(() => {
    if (transitionCycle > 0) {
      startRef.current = performance.now() / 1000;
    }
  }, [transitionCycle]);

  return startRef;
}

function getTransitionEnvelope(now: number, startTime: number) {
  if (startTime === 0) {
    return 0;
  }

  const duration = 1.18;
  const elapsed = now - startTime;

  if (elapsed < 0 || elapsed > duration) {
    return 0;
  }

  const progress = elapsed / duration;
  return Math.sin(progress * Math.PI) * (1 - progress * 0.12);
}

function CameraRig({
  activePrincipleKey,
  liteMode,
  pointer,
  scrollProgress,
  sceneMode,
  transitionCycle,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  pointer: PointerState;
  scrollProgress: number;
  sceneMode: SceneMode;
  transitionCycle: number;
}) {
  const transitionStartRef = useTransitionStart(transitionCycle);

  useFrame((state) => {
    const rigCamera = state.camera as PerspectiveCameraType;
    const influence = activeOffsets[activePrincipleKey] ?? 0;
    const theaterBoost = sceneMode === "theater" ? 1 : 0;
    const transitionEnvelope = getTransitionEnvelope(state.clock.getElapsedTime(), transitionStartRef.current);
    const targetX =
      (pointer.x - 0.5) * (liteMode ? 0.9 : 1.6) +
      Math.sin(influence) * 0.18 +
      theaterBoost * 0.08 +
      Math.sin(influence * 4 + transitionEnvelope * 5) * 0.08 * transitionEnvelope;
    const targetY =
      (0.5 - pointer.y) * (liteMode ? 0.7 : 1.3) +
      Math.cos(influence) * 0.12 +
      theaterBoost * 0.04 +
      transitionEnvelope * 0.08;
    const narrativeDrift =
      scrollProgress * (liteMode ? 0.24 : 0.52) + theaterBoost * (liteMode ? 0.08 : 0.22);
    const targetZ =
      activePrincipleKey === "contrast" ? (liteMode ? 8 : 7.55) : liteMode ? 8.45 : 8.15;

    rigCamera.position.x = THREE.MathUtils.lerp(rigCamera.position.x, targetX, 0.05);
    rigCamera.position.y = THREE.MathUtils.lerp(
      rigCamera.position.y,
      targetY + narrativeDrift,
      0.05,
    );
    rigCamera.position.z = THREE.MathUtils.lerp(
      rigCamera.position.z,
      targetZ - scrollProgress * 0.28 - theaterBoost * 0.26 - transitionEnvelope * 0.34,
      0.04,
    );
    rigCamera.rotation.z = THREE.MathUtils.lerp(
      rigCamera.rotation.z,
      (scrollProgress - 0.35) * 0.05 + theaterBoost * 0.03 + transitionEnvelope * 0.04,
      0.035,
    );
    rigCamera.lookAt(0, scrollProgress * 0.45 + theaterBoost * 0.18 + transitionEnvelope * 0.16, 0);
  });

  return null;
}

function NarrativeBackdrop({
  activePrincipleKey,
  liteMode,
  palette,
  scrollProgress,
  sceneMode,
  transitionCycle,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  palette: Palette;
  scrollProgress: number;
  sceneMode: SceneMode;
  transitionCycle: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const material = useMemo(() => {
    const config: ShaderMaterialParameters = {
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPrimary: { value: new THREE.Color(palette.primary) },
        uSecondary: { value: new THREE.Color(palette.secondary) },
        uTertiary: { value: new THREE.Color(palette.tertiary) },
        uScroll: { value: 0 },
        uFocus: { value: 0 },
      },
      vertexShader: backdropVertexShader,
      fragmentShader: backdropFragmentShader,
    };

    return new THREE.ShaderMaterial(config) as BackdropMaterialImpl;
  }, [palette.primary, palette.secondary, palette.tertiary]);
  const materialRef = useRef<BackdropMaterialImpl | null>(null);
  const transitionStartRef = useTransitionStart(transitionCycle);

  useEffect(() => {
    materialRef.current = material;

    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const theaterBoost = sceneMode === "theater" ? 1 : 0;
    const transitionEnvelope = getTransitionEnvelope(t, transitionStartRef.current);
    const focus =
      (focusStrengths[activePrincipleKey] ?? 1) + scrollProgress * 0.24 + theaterBoost * 0.32 + transitionEnvelope * 0.26;

    if (meshRef.current) {
      meshRef.current.position.y = scrollProgress * 0.85 + theaterBoost * 0.25;
      meshRef.current.position.z = -5.6 + scrollProgress * 0.2 + theaterBoost * 0.16;
      meshRef.current.rotation.z = Math.sin(t * 0.14) * 0.09 + theaterBoost * 0.03 + transitionEnvelope * 0.06;
      meshRef.current.scale.x = 1 + scrollProgress * 0.12 + theaterBoost * 0.18 + transitionEnvelope * 0.18;
      meshRef.current.scale.y = 1 + scrollProgress * 0.18 + theaterBoost * 0.24 + transitionEnvelope * 0.22;
    }

    const backdropMaterial = materialRef.current;

    if (!backdropMaterial) {
      return;
    }

    backdropMaterial.uniforms.uTime.value = t;
    backdropMaterial.uniforms.uScroll.value = scrollProgress;
    backdropMaterial.uniforms.uFocus.value = focus;
    backdropMaterial.uniforms.uPrimary.value.set(palette.primary);
    backdropMaterial.uniforms.uSecondary.value.set(palette.secondary);
    backdropMaterial.uniforms.uTertiary.value.set(palette.tertiary);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.15, -5.6]}>
      <planeGeometry args={[liteMode ? 10 : 14, liteMode ? 8 : 11]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function AuraShell({
  activePrincipleKey,
  balanceCycle,
  liteMode,
  palette,
  scrollProgress,
}: {
  activePrincipleKey: string;
  balanceCycle: number;
  liteMode: boolean;
  palette: Palette;
  scrollProgress: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const balanceStartRef = useBalanceStart(activePrincipleKey, balanceCycle);
  const material = useMemo(() => {
    const config: ShaderMaterialParameters = {
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPrimary: { value: new THREE.Color(palette.primary) },
        uSecondary: { value: new THREE.Color(palette.secondary) },
        uScroll: { value: 0 },
        uPulse: { value: 0 },
      },
      vertexShader: auraVertexShader,
      fragmentShader: auraFragmentShader,
    };

    return new THREE.ShaderMaterial(config) as AuraMaterialImpl;
  }, [palette.primary, palette.secondary]);
  const materialRef = useRef<AuraMaterialImpl | null>(null);

  useEffect(() => {
    materialRef.current = material;

    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const balanceEnvelope =
      activePrincipleKey === "balance" ? getBalanceEnvelope(t, balanceStartRef.current) : 0;
    const pulse = balanceEnvelope + scrollProgress * 0.6;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * (liteMode ? 0.08 : 0.14);
      meshRef.current.rotation.x = Math.sin(t * 0.18) * 0.06;
      meshRef.current.scale.setScalar(1.38 + pulse * 0.16);
    }

    const auraMaterial = materialRef.current;

    if (!auraMaterial) {
      return;
    }

    auraMaterial.uniforms.uTime.value = t;
    auraMaterial.uniforms.uScroll.value = scrollProgress;
    auraMaterial.uniforms.uPulse.value = pulse;
    auraMaterial.uniforms.uPrimary.value.set(palette.primary);
    auraMaterial.uniforms.uSecondary.value.set(palette.secondary);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.52, liteMode ? 28 : 44, liteMode ? 28 : 44]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Orb({
  activePrincipleKey,
  balanceCycle,
  liteMode,
  palette,
  scrollProgress,
}: {
  activePrincipleKey: string;
  balanceCycle: number;
  liteMode: boolean;
  palette: Palette;
  scrollProgress: number;
}) {
  const groupRef = useRef<Group>(null);
  const shellRef = useRef<Mesh>(null);
  const prismRef = useRef<Mesh>(null);
  const accentRef = useRef<Mesh>(null);
  const balanceStartRef = useBalanceStart(activePrincipleKey, balanceCycle);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const balanceEnvelope =
      activePrincipleKey === "balance" ? getBalanceEnvelope(t, balanceStartRef.current) : 0;
    const contrastBoost = activePrincipleKey === "contrast" ? 1 : 0;
    const rhythmBeat = activePrincipleKey === "rhythm" ? (Math.sin(t * 3.4) + 1) * 0.5 : 0;
    const unityPull = activePrincipleKey === "unity" ? 1 : 0;
    const motionFactor = liteMode ? 0.7 : 1;
    const narrativeLift = scrollProgress * 0.18;

    if (groupRef.current) {
      groupRef.current.rotation.y =
        t * (0.18 + rhythmBeat * 0.05 + contrastBoost * 0.04) * motionFactor;
      groupRef.current.rotation.x =
        Math.sin(t * 0.22) * (0.12 + balanceEnvelope * 0.08) * motionFactor;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        narrativeLift,
        0.06,
      );
      const scale =
        1 +
        balanceEnvelope * 0.08 -
        unityPull * 0.05 +
        rhythmBeat * 0.03 +
        scrollProgress * 0.04;
      groupRef.current.scale.setScalar(scale);
    }

    if (shellRef.current) {
      const shellScale =
        1 +
        Math.sin(t * 1.1) * 0.03 +
        balanceEnvelope * 0.1 +
        contrastBoost * 0.04 +
        scrollProgress * 0.06;
      shellRef.current.scale.setScalar(shellScale);
    }

    if (prismRef.current) {
      prismRef.current.rotation.z = t * (0.32 + contrastBoost * 0.12) * motionFactor;
      prismRef.current.rotation.x =
        Math.sin(t * 0.7) * (0.16 + balanceEnvelope * 0.12) * motionFactor;
      prismRef.current.rotation.y = rhythmBeat * 0.35 * motionFactor;
      const prismScale = 1 + unityPull * 0.08 - balanceEnvelope * 0.16 + scrollProgress * 0.05;
      prismRef.current.scale.setScalar(prismScale);
    }

    if (accentRef.current) {
      const pulse =
        1.1 +
        Math.sin(t * (1.4 + rhythmBeat * 1.2)) * 0.06 +
        balanceEnvelope * 0.18 +
        scrollProgress * 0.08;
      accentRef.current.scale.setScalar(pulse);
    }
  });

  const shellSegments = liteMode ? 40 : 64;

  return (
    <group ref={groupRef}>
      <AuraShell
        activePrincipleKey={activePrincipleKey}
        balanceCycle={balanceCycle}
        liteMode={liteMode}
        palette={palette}
        scrollProgress={scrollProgress}
      />

      <mesh ref={shellRef}>
        <sphereGeometry args={[1.28, shellSegments, shellSegments]} />
        <MeshTransmissionMaterial
          samples={liteMode ? 2 : 6}
          resolution={liteMode ? 128 : 256}
          thickness={0.32}
          chromaticAberration={liteMode ? 0.04 : 0.08}
          anisotropy={0.1}
          distortion={liteMode ? 0.1 : 0.16}
          distortionScale={liteMode ? 0.15 : 0.24}
          temporalDistortion={liteMode ? 0.04 : 0.08}
          iridescence={0.7}
          iridescenceIOR={1.2}
          color={palette.tertiary}
          attenuationColor={palette.primary}
          attenuationDistance={1.3}
          roughness={0.04}
        />
      </mesh>

      <mesh ref={prismRef} rotation={[0.35, 0.3, 0.6]}>
        <octahedronGeometry args={[0.82, 0]} />
        <meshStandardMaterial
          color={palette.tertiary}
          emissive={palette.primary}
          emissiveIntensity={1.2 + scrollProgress * 0.35}
          metalness={0.35}
          roughness={0.18}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh ref={accentRef} scale={1.18}>
        <torusGeometry args={[1.58, 0.03, 24, liteMode ? 96 : 160]} />
        <meshBasicMaterial color={palette.primary} transparent opacity={0.58} />
      </mesh>

      <mesh rotation={[Math.PI / 2.2, 0.3, 0.6]} scale={1.34}>
        <torusGeometry args={[1.68, 0.028, 20, liteMode ? 88 : 160]} />
        <meshBasicMaterial color={palette.secondary} transparent opacity={0.34} />
      </mesh>
    </group>
  );
}

function SatelliteMesh({
  geometry,
  liteMode,
  palette,
  isActive,
}: {
  geometry: "sphere" | "torus" | "box" | "octahedron";
  liteMode: boolean;
  palette: Palette;
  isActive: boolean;
}) {
  const materialProps = {
    color: palette.tertiary,
    emissive: isActive ? palette.primary : palette.secondary,
    emissiveIntensity: isActive ? 1.4 : 0.6,
    metalness: 0.45,
    roughness: 0.14,
    transparent: true,
    opacity: isActive ? 0.98 : 0.88,
  } as const;

  if (geometry === "torus") {
    return (
      <mesh>
        <torusGeometry args={[0.42, 0.12, liteMode ? 16 : 24, liteMode ? 64 : 120]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    );
  }

  if (geometry === "box") {
    return (
      <mesh rotation={[0.6, 0.8, 0.3]}>
        <boxGeometry args={[0.66, 0.66, 0.66]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    );
  }

  if (geometry === "octahedron") {
    return (
      <mesh rotation={[0.4, 0.6, 0.8]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    );
  }

  return (
    <mesh>
      <sphereGeometry args={[0.42, liteMode ? 24 : 42, liteMode ? 24 : 42]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

function SatelliteInstance({
  activePrincipleKey,
  balanceCycle,
  basePosition,
  geometry,
  index,
  isActive,
  liteMode,
  palette,
  scale,
  scrollProgress,
}: {
  activePrincipleKey: string;
  balanceCycle: number;
  basePosition: Vector3Tuple;
  geometry: "sphere" | "torus" | "box" | "octahedron";
  index: number;
  isActive: boolean;
  liteMode: boolean;
  palette: Palette;
  scale: number;
  scrollProgress: number;
}) {
  const groupRef = useRef<Group>(null);
  const balanceStartRef = useBalanceStart(activePrincipleKey, balanceCycle);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const balanceEnvelope =
      activePrincipleKey === "balance" ? getBalanceEnvelope(t, balanceStartRef.current) : 0;
    const rhythmBeat =
      activePrincipleKey === "rhythm" ? Math.sin(t * 3.2 + index * 0.8) * 0.34 : 0;
    const unityPull = activePrincipleKey === "unity" ? 0.28 : 0;
    const contrastBoost = activePrincipleKey === "contrast" && isActive ? 1 : 0;
    const motionFactor = liteMode ? 0.72 : 1;

    const targetX =
      basePosition[0] * (1 - unityPull + balanceEnvelope * 0.14) +
      (contrastBoost ? Math.sign(basePosition[0]) * 0.28 : 0);
    const targetY =
      basePosition[1] * (1 - unityPull * 0.7) +
      rhythmBeat -
      balanceEnvelope * 0.12 +
      scrollProgress * 0.06;
    const targetZ =
      basePosition[2] + balanceEnvelope * 0.55 + (contrastBoost ? 0.55 : 0) + scrollProgress * 0.2;
    const targetScale =
      scale *
      (isActive ? 1.18 : 1) *
      (1 + balanceEnvelope * 0.16 + contrastBoost * 0.08 + scrollProgress * 0.05);

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
      groupRef.current.rotation.x += (0.01 + index * 0.0008) * motionFactor;
      groupRef.current.rotation.y += (0.012 + contrastBoost * 0.01) * motionFactor;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.09),
      );
    }
  });

  return (
    <Float
      speed={liteMode ? 0.65 + index * 0.08 : 1 + index * 0.15}
      rotationIntensity={liteMode ? 0.25 : 0.6}
      floatIntensity={liteMode ? 0.34 : 0.8}
      floatingRange={liteMode ? [-0.05, 0.05] : [-0.12, 0.12]}
    >
      <group ref={groupRef} position={basePosition} scale={scale}>
        <SatelliteMesh geometry={geometry} liteMode={liteMode} palette={palette} isActive={isActive} />
      </group>
    </Float>
  );
}

function SatelliteField({
  activePrincipleKey,
  balanceCycle,
  liteMode,
  palette,
  scrollProgress,
}: {
  activePrincipleKey: string;
  balanceCycle: number;
  liteMode: boolean;
  palette: Palette;
  scrollProgress: number;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      const speed = activePrincipleKey === "rhythm" ? 0.22 : 0.14;
      groupRef.current.rotation.y = t * (liteMode ? speed * 0.7 : speed);
      groupRef.current.rotation.x = scrollProgress * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {satellites.map((satellite, index) => (
        <SatelliteInstance
          key={satellite.key}
          activePrincipleKey={activePrincipleKey}
          balanceCycle={balanceCycle}
          basePosition={satellite.position}
          geometry={satellite.geometry}
          index={index}
          isActive={satellite.key === activePrincipleKey}
          liteMode={liteMode}
          palette={palette}
          scale={satellite.scale}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  );
}

function EnergyTrails({
  activePrincipleKey,
  liteMode,
  palette,
  scrollProgress,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  palette: Palette;
  scrollProgress: number;
}) {
  const groupRef = useRef<Group>(null);
  const trails = useMemo(() => {
    const definitions = liteMode
      ? [
          { color: palette.primary, radius: 2.4, tiltX: 0.9, tiltY: 0.2 },
          { color: palette.secondary, radius: 3, tiltX: 1.2, tiltY: -0.35 },
        ]
      : [
          { color: palette.primary, radius: 2.4, tiltX: 0.9, tiltY: 0.2 },
          { color: palette.secondary, radius: 3, tiltX: 1.2, tiltY: -0.35 },
          { color: palette.tertiary, radius: 3.45, tiltX: 0.45, tiltY: 0.7 },
        ];

    return definitions.map((definition, index) => {
      const curve = new THREE.EllipseCurve(
        0,
        0,
        definition.radius,
        definition.radius * (0.48 + index * 0.08),
        0,
        Math.PI * 2,
        false,
        index * 0.6,
      );
      const points = curve
        .getPoints(liteMode ? 72 : 120)
        .map((point) => [point.x, point.y, 0] as Vector3Tuple);
      return { ...definition, points };
    });
  }, [liteMode, palette.primary, palette.secondary, palette.tertiary]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      const rhythmBoost = activePrincipleKey === "rhythm" ? 1.45 : 1;
      groupRef.current.rotation.y = t * (0.08 + scrollProgress * 0.04) * rhythmBoost;
      groupRef.current.rotation.z = Math.sin(t * 0.25) * (0.08 + scrollProgress * 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      {trails.map((trail, index) => {
        const emphasis =
          activePrincipleKey === "balance"
            ? 0.9
            : activePrincipleKey === "contrast"
              ? 1.15
              : 1;
        return (
          <Line
            key={trail.color + String(index)}
            points={trail.points}
            color={trail.color}
            transparent
            opacity={(liteMode ? 0.22 : 0.34) + scrollProgress * 0.08}
            lineWidth={emphasis * (liteMode ? 0.7 : 1.1)}
            position={[0, 0, index * 0.04 - 0.08]}
            rotation={[trail.tiltX, trail.tiltY, index * 0.32 + scrollProgress * 0.2]}
          />
        );
      })}
    </group>
  );
}

function PrincipleField({
  activePrincipleKey,
  liteMode,
  palette,
  sceneMode,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  palette: Palette;
  sceneMode: SceneMode;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = t * (activePrincipleKey === "rhythm" ? 0.22 : 0.12);
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
    groupRef.current.scale.setScalar(sceneMode === "theater" ? 1.06 : 1);
  });

  if (activePrincipleKey === "balance") {
    return (
      <group ref={groupRef}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.03, liteMode ? 3 : 3.6, 0.03]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.18} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.03, liteMode ? 3 : 3.6, 0.03]} />
          <meshBasicMaterial color={palette.tertiary} transparent opacity={0.12} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.94, 0.03, 18, liteMode ? 84 : 148]} />
          <meshBasicMaterial color={palette.secondary} transparent opacity={0.12} />
        </mesh>
      </group>
    );
  }

  if (activePrincipleKey === "contrast") {
    return (
      <group ref={groupRef}>
        <mesh position={[-1.5, 0, 0.1]} rotation={[0, 0, 0.44]}>
          <boxGeometry args={[0.08, 4.1, 0.08]} />
          <meshBasicMaterial color={palette.secondary} transparent opacity={0.22} />
        </mesh>
        <mesh position={[1.5, 0, -0.12]} rotation={[0, 0, -0.44]}>
          <boxGeometry args={[0.08, 4.3, 0.08]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.28} />
        </mesh>
      </group>
    );
  }

  if (activePrincipleKey === "rhythm") {
    return (
      <group ref={groupRef}>
        {[1.3, 1.7, 2.12].map((radius, index) => (
          <mesh key={String(radius)} rotation={[Math.PI / 2, 0, 0]} position={[0, index * 0.08 - 0.08, 0]}>
            <torusGeometry args={[radius, 0.03, 18, liteMode ? 88 : 150]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? palette.primary : palette.secondary}
              transparent
              opacity={0.12 + index * 0.05}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.72, 0]} />
        <meshBasicMaterial color={palette.primary} wireframe transparent opacity={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.24, liteMode ? 22 : 34, liteMode ? 22 : 34]} />
        <meshBasicMaterial color={palette.tertiary} wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function ChapterGlyph({
  activePrincipleKey,
  liteMode,
  palette,
  scrollProgress,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  palette: Palette;
  scrollProgress: number;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!groupRef.current) {
      return;
    }

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      scrollProgress * 0.42,
      0.06,
    );
    groupRef.current.rotation.y = t * 0.14;
    groupRef.current.rotation.z = Math.sin(t * 0.38) * 0.08;
  });

  if (activePrincipleKey === "balance") {
    return (
      <group ref={groupRef}>
        <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.62, 0.035, 18, liteMode ? 90 : 160]} />
          <meshBasicMaterial color={palette.tertiary} transparent opacity={0.28} />
        </mesh>
        <mesh position={[0, -1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.62, 0.035, 18, liteMode ? 90 : 160]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.32} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.04, 3.4, 0.04]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.04, 3.4, 0.04]} />
          <meshBasicMaterial color={palette.secondary} transparent opacity={0.14} />
        </mesh>
      </group>
    );
  }

  if (activePrincipleKey === "contrast") {
    return (
      <group ref={groupRef} rotation={[0.18, 0, 0]}>
        <mesh position={[-1.25, 0, 0.5]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.12, 4, 0.12]} />
          <meshBasicMaterial color={palette.secondary} transparent opacity={0.36} />
        </mesh>
        <mesh position={[1.25, 0, -0.35]} rotation={[0, 0, -0.44]}>
          <boxGeometry args={[0.12, 4.2, 0.12]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.42} />
        </mesh>
        <mesh position={[0, 0, -0.1]} rotation={[0.5, 0.26, 0]}>
          <torusGeometry args={[1.9, 0.045, 20, liteMode ? 72 : 140]} />
          <meshBasicMaterial color={palette.tertiary} transparent opacity={0.2} />
        </mesh>
      </group>
    );
  }

  if (activePrincipleKey === "rhythm") {
    return (
      <group ref={groupRef}>
        {[-0.75, 0, 0.75].map((offset, index) => (
          <mesh key={String(offset)} position={[0, offset, index * 0.12 - 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.45 + index * 0.26, 0.04, 18, liteMode ? 84 : 156]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? palette.primary : palette.secondary}
              transparent
              opacity={0.24 + index * 0.05}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.9, 0]} />
        <meshBasicMaterial color={palette.primary} wireframe transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.32, liteMode ? 24 : 40, liteMode ? 24 : 40]} />
        <meshBasicMaterial color={palette.tertiary} wireframe transparent opacity={0.12} />
      </mesh>
      {[-1, 1].map((direction) => (
        <mesh key={String(direction)} position={[direction * 1.7, direction * 0.58, 0.2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={palette.secondary} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function TransitionField({
  activePrincipleKey,
  liteMode,
  palette,
  transitionCycle,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  palette: Palette;
  transitionCycle: number;
}) {
  const groupRef = useRef<Group>(null);
  const ringRefs = useRef<Mesh[]>([]);
  const materialRefs = useRef<MeshBasicMaterialType[]>([]);
  const transitionStartRef = useTransitionStart(transitionCycle);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const envelope = getTransitionEnvelope(t, transitionStartRef.current);

    if (!groupRef.current) {
      return;
    }

    groupRef.current.visible = envelope > 0.001;
    groupRef.current.rotation.z = t * 0.16;

    ringRefs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const offset = index * 0.14;
      const scale = 1 + envelope * (0.22 + offset);
      mesh.scale.setScalar(scale);
      mesh.position.z = -0.18 + index * 0.12 + envelope * 0.2;
    });

    materialRefs.current.forEach((material, index) => {
      if (!material) {
        return;
      }

      material.opacity = envelope * (0.22 - index * 0.04);
    });
  });

  const colors = [palette.primary, palette.secondary, palette.tertiary];

  return (
    <group ref={groupRef}>
      {colors.map((color, index) => (
        <mesh
          key={color + String(index)}
          ref={(element) => {
            if (element) {
              ringRefs.current[index] = element;
            }
          }}
          rotation={[Math.PI / 2, 0, index * 0.32 + (activePrincipleKey === "contrast" ? 0.22 : 0)]}
        >
          <torusGeometry args={[1.86 + index * 0.24, 0.032, 18, liteMode ? 92 : 152]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) {
                materialRefs.current[index] = material;
              }
            }}
            color={color}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function PostEffects({
  activePrincipleKey,
  liteMode,
  scrollProgress,
  sceneMode,
  chapterOverlayOpen,
}: {
  activePrincipleKey: string;
  liteMode: boolean;
  scrollProgress: number;
  sceneMode: SceneMode;
  chapterOverlayOpen: boolean;
}) {
  const theaterBoost = sceneMode === "theater" ? 0.22 : 0;
  const chapterBoost = chapterOverlayOpen ? 0.2 : 0;
  const bloomIntensity =
    activePrincipleKey === "contrast" ? 1.1 : activePrincipleKey === "balance" ? 0.92 : 0.82;

  return (
    <EffectComposer multisampling={liteMode ? 0 : 4} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.28}
        luminanceSmoothing={0.48}
        intensity={
          liteMode
            ? bloomIntensity * 0.6 + scrollProgress * 0.08 + theaterBoost * 0.12 + chapterBoost * 0.1
            : bloomIntensity + scrollProgress * 0.2 + theaterBoost + chapterBoost
        }
      />
      <Noise opacity={liteMode ? 0.01 + chapterBoost * 0.01 : 0.022 + theaterBoost * 0.02 + chapterBoost * 0.02} />
      <Vignette
        eskil={false}
        offset={0.18}
        darkness={liteMode ? 0.46 + chapterBoost * 0.05 : 0.58 + theaterBoost * 0.12 + chapterBoost * 0.08}
      />
    </EffectComposer>
  );
}

const SceneContent = memo(function SceneContent({
  activePrincipleKey,
  balanceCycle,
  transitionCycle,
  era,
  liteMode,
  pointer,
  scrollProgress,
  sceneMode,
  chapterOverlayOpen,
}: CodexSceneProps) {
  const palette = useMemo(() => palettes[era], [era]);
  const lightBoost = activePrincipleKey === "contrast" ? 1.25 : 1;
  const theaterBoost = sceneMode === "theater" ? 1 : 0;
  const chapterBoost = chapterOverlayOpen ? 1 : 0;
  const narrativeBoost = 1 + scrollProgress * 0.2 + theaterBoost * 0.16 + chapterBoost * 0.12;

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog
        attach="fog"
        args={[
          palette.fog,
          liteMode ? 8 - chapterBoost * 0.25 : 7 - chapterBoost * 0.4,
          liteMode ? 13 - chapterBoost * 0.45 : 15 + scrollProgress * 2 - chapterBoost * 0.85,
        ]}
      />
      <ambientLight intensity={(liteMode ? 0.78 : 0.9) * narrativeBoost} color={palette.ambient} />
      <directionalLight
        position={[3.5, 5, 4.5]}
        intensity={(liteMode ? 2.2 : 2.8) * lightBoost * narrativeBoost}
        color={palette.tertiary}
      />
      <pointLight
        position={[-4, -1.5, 2]}
        intensity={(liteMode ? 16 : 22) * lightBoost * narrativeBoost * (1 + chapterBoost * 0.08)}
        distance={12}
        color={palette.primary}
      />
      <pointLight
        position={[4, 2.5, -2]}
        intensity={(liteMode ? 8 : 12) * lightBoost * narrativeBoost * (1 + chapterBoost * 0.12)}
        distance={10}
        color={palette.secondary}
      />
      <CameraRig
        pointer={pointer}
        activePrincipleKey={activePrincipleKey}
        liteMode={liteMode}
        scrollProgress={scrollProgress}
        sceneMode={sceneMode}
        transitionCycle={transitionCycle}
      />
      <NarrativeBackdrop
        activePrincipleKey={activePrincipleKey}
        liteMode={liteMode}
        palette={palette}
        scrollProgress={scrollProgress}
        sceneMode={sceneMode}
        transitionCycle={transitionCycle}
      />
      {liteMode ? null : <Environment preset="sunset" />}
      <Sparkles
        count={liteMode ? (chapterOverlayOpen ? 86 : 64) : sceneMode === "theater" ? (chapterOverlayOpen ? 228 : 170) : 140}
        scale={
          liteMode
            ? [8, 6, 6]
            : [10 + theaterBoost * 1.2 + chapterBoost * 0.9, 8 + scrollProgress * 2 + chapterBoost * 0.6, 8 + theaterBoost * 1.4 + chapterBoost * 1.1]
        }
        size={liteMode ? 1.8 + chapterBoost * 0.15 : 2.6 + scrollProgress * 0.4 + theaterBoost * 0.25 + chapterBoost * 0.18}
        speed={liteMode ? 0.28 + chapterBoost * 0.05 : 0.45 + scrollProgress * 0.1 + theaterBoost * 0.12 + chapterBoost * 0.08}
        color={palette.sparkles}
      />
      <EnergyTrails
        activePrincipleKey={activePrincipleKey}
        liteMode={liteMode}
        palette={palette}
        scrollProgress={scrollProgress}
      />
      <PrincipleField
        activePrincipleKey={activePrincipleKey}
        liteMode={liteMode}
        palette={palette}
        sceneMode={sceneMode}
      />
      <TransitionField
        activePrincipleKey={activePrincipleKey}
        liteMode={liteMode}
        palette={palette}
        transitionCycle={transitionCycle}
      />
      {chapterOverlayOpen ? (
        <ChapterGlyph
          activePrincipleKey={activePrincipleKey}
          liteMode={liteMode}
          palette={palette}
          scrollProgress={scrollProgress}
        />
      ) : null}
      <Orb
        activePrincipleKey={activePrincipleKey}
        balanceCycle={balanceCycle}
        liteMode={liteMode}
        palette={palette}
        scrollProgress={scrollProgress}
      />
      <SatelliteField
        activePrincipleKey={activePrincipleKey}
        balanceCycle={balanceCycle}
        liteMode={liteMode}
        palette={palette}
        scrollProgress={scrollProgress}
      />
      <PostEffects
        activePrincipleKey={activePrincipleKey}
        liteMode={liteMode}
        scrollProgress={scrollProgress}
        sceneMode={sceneMode}
        chapterOverlayOpen={chapterOverlayOpen}
      />
    </>
  );
});

export function CodexScene(props: CodexSceneProps) {
  return (
    <div className="lumina-scene" aria-hidden="true">
      <Canvas
        dpr={props.liteMode ? [1, 1.2] : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.2, 8.2], fov: props.liteMode ? 36 : 34 }}
      >
        <SceneContent {...props} />
      </Canvas>
      <div className="lumina-scene__vignette" />
      <div className="lumina-scene__scrim" />
    </div>
  );
}
