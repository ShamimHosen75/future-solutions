"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSpeed;
  attribute float aSeed;
  attribute float aSize;
  varying float vProgress;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // Flow left → right and wrap inside a 14-unit wide volume.
    float travel = mod(p.x + uTime * uSpeed * (0.6 + aSeed * 0.8) + 7.0, 14.0) - 7.0;
    p.x = travel;
    p.y += sin(uTime * (0.4 + aSeed) + aSeed * 6.283) * 0.35;
    p.z += cos(uTime * (0.3 + aSeed * 0.5) + aSeed * 3.14) * 0.25;

    vProgress = clamp((travel + 7.0) / 14.0, 0.0, 1.0);
    // Fade at the edges of the volume and with depth.
    float edge = smoothstep(0.0, 0.12, vProgress) * (1.0 - smoothstep(0.88, 1.0, vProgress));
    vAlpha = edge * (0.35 + 0.65 * aSeed);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (18.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uCyan;
  uniform vec3 uOrange;
  uniform vec3 uAmber;
  varying float vProgress;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 1.8);

    vec3 color = mix(uBlue, uCyan, smoothstep(0.0, 0.45, vProgress));
    color = mix(color, uOrange, smoothstep(0.45, 0.7, vProgress));
    color = mix(color, uAmber, smoothstep(0.7, 1.0, vProgress));

    gl_FragColor = vec4(color * 1.4, glow * vAlpha);
  }
`;

type ParticlesProps = {
  count?: number;
  speed?: number;
};

/** Blue → orange particle field flowing behind the logo. Additive, depth-less. */
export function Particles({ count = 1400, speed = 0.9 }: ParticlesProps) {
  const material = React.useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds, sizes } = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
      seeds[i] = Math.random();
      sizes[i] = 0.6 + Math.random() * 1.8;
    }
    return { positions, seeds, sizes };
  }, [count]);

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uPixelRatio: { value: 1 },
      uBlue: { value: new THREE.Color("#0A3DFF") },
      uCyan: { value: new THREE.Color("#12C8FF") },
      uOrange: { value: new THREE.Color("#FF5A0A") },
      uAmber: { value: new THREE.Color("#FFA31A") },
    }),
    [speed],
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms["uTime"]!.value = state.clock.elapsedTime;
    material.current.uniforms["uPixelRatio"]!.value = state.gl.getPixelRatio();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
