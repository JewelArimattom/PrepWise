"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────
   PARTICLES — 1 500 blue dots in a sphere-ish cloud
   They slowly rotate and tilt to follow the cursor.
───────────────────────────────────────────────────────── */
function Particles({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null!);

  /* deterministic positions — no Math.random() at render time */
  const positions = useMemo(() => {
    const count = 1500;
    const arr = new Float32Array(count * 3);
    /* seeded pseudo-random using golden ratio so it's stable on hydration */
    let seed = 1;
    const rng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (rng() - 0.5) * 10;
      arr[i * 3 + 1] = (rng() - 0.5) * 10;
      arr[i * 3 + 2] = (rng() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    /* gentle base rotation */
    ref.current.rotation.y += delta * 0.04;
    /* mouse parallax — lerp toward target for smoothness */
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      mouse.current.y * 0.25,
      0.05
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.current.x * 0.25,
      0.05
    );
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.025}
        color="#60a5fa"
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

/* ─────────────────────────────────────────────────────────
   AI ORB — glowing sphere at center, follows mouse subtly,
   pulses slowly like a heartbeat.
───────────────────────────────────────────────────────── */
function AIOrb({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat  = useRef<THREE.MeshStandardMaterial>(null!);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!mesh.current || !mat.current) return;
    clock.current += delta;

    /* slow pulse — scale breathes gently */
    const pulse = 1 + Math.sin(clock.current * 1.2) * 0.06;
    mesh.current.scale.setScalar(pulse);

    /* slow spin */
    mesh.current.rotation.y += delta * 0.3;

    /* follow mouse with lerp */
    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      mouse.current.x * 1.2,
      0.04
    );
    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      -mouse.current.y * 1.2,
      0.04
    );

    /* emissive pulse */
    mat.current.emissiveIntensity = 0.8 + Math.sin(clock.current * 1.2) * 0.4;
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[0.55, 48, 48]} />
      <meshStandardMaterial
        ref={mat}
        color="#a78bfa"
        emissive="#60a5fa"
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────
   OUTER GLOW RING — wireframe torus that counter-rotates
───────────────────────────────────────────────────────── */
function GlowRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.z += delta * 0.08;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[1.1, 0.004, 16, 100]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.35} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────
   SCENE — composes all 3D elements
───────────────────────────────────────────────────────── */
function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#a78bfa" />
      <AIOrb mouse={mouse} />
      <GlowRing />
      <Particles mouse={mouse} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT EXPORT — handles: mobile bail-out, mouse tracking,
   and the Canvas wrapper.
───────────────────────────────────────────────────────── */
export default function InteractiveAIBackground() {
  const mouse = useRef({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    /* skip on mobile — no cost for those users */
    if (window.innerWidth >= 768) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ opacity: 0.45 }}
      onMouseMove={(e) => {
        mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, powerPreference: "low-power" }}
        dpr={[1, 1.5]}           /* cap device pixel ratio — big win on Retina */
        frameloop="always"
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
