"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { FSLogo } from "./fs-logo";
import { Particles } from "./particles";

type HeroSceneProps = {
  /** Pause rendering when the hero is scrolled out of view. */
  active?: boolean;
  reducedMotion?: boolean;
  onReady?: () => void;
};

/** Tracks the pointer across the whole window (not just the canvas) in NDC. */
function usePointer(enabled: boolean) {
  const pointer = React.useRef(new THREE.Vector2(0, 0));
  const target = React.useRef(new THREE.Vector2(0, 0));
  React.useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    const onLeave = () => target.current.set(0, 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);
  return { pointer, target };
}

function PointerDamping({
  pointer,
  target,
}: {
  pointer: React.RefObject<THREE.Vector2>;
  target: React.RefObject<THREE.Vector2>;
}) {
  useFrame((_, delta) => {
    const ease = 1 - Math.pow(0.0005, delta);
    pointer.current.lerp(target.current, ease);
  });
  return null;
}

/** Signals the parent once the first frame has been drawn so the fallback can fade. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = React.useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });
  return null;
}

function Rig() {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export default function HeroScene({ active = true, reducedMotion = false, onReady }: HeroSceneProps) {
  const { pointer, target } = usePointer(!reducedMotion);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 32, near: 0.1, far: 60, position: [0, 0, 7.5] }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <Rig />
      <PointerDamping pointer={pointer} target={target} />
      <ReadySignal onReady={onReady} />

      {/* Lighting: cool key from the left, warm rim from the right */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[-6, 6, 7]} intensity={2.4} color="#ffffff" castShadow />
      <directionalLight position={[6, -2, 5]} intensity={0.8} color="#ffe9d6" />
      <pointLight position={[6, -3, 3]} intensity={10} color="#FF5A0A" distance={18} decay={2} />
      <pointLight position={[-6, 4, -1]} intensity={8} color="#0A3DFF" distance={18} decay={2} />

      {/* Procedural environment: no HDR download, metallic reflections still read as studio */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} color="#ffffff" position={[0, 6, -4]} scale={[12, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 0, 8]} scale={[8, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#12C8FF" position={[-8, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#FFA31A" position={[8, -1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={2} color="#D9DDE3" position={[0, -5, 3]} scale={4} />
      </Environment>

      <React.Suspense fallback={null}>
        <FSLogo pointer={pointer} reducedMotion={reducedMotion} />
        {!reducedMotion ? <Particles count={1400} /> : <Particles count={400} speed={0} />}
        <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={12} blur={2.6} far={4} color="#000" />
      </React.Suspense>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom intensity={0.7} luminanceThreshold={0.75} luminanceSmoothing={0.25} mipmapBlur radius={0.6} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
