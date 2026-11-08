"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const F_PATH = "M52 56h84v26H82v34h46v26H82v58H52z";
const S_PATH =
  "M204 86c-6-16-21-27-44-27-26 0-45 14-45 36 0 20 13 30 40 37l10 3c13 4 17 8 17 15 0 8-8 14-21 14-14 0-24-7-27-19l-27 7c6 23 26 38 54 38 29 0 49-15 49-40 0-21-13-32-38-39l-12-3c-12-3-17-7-17-13 0-7 7-12 17-12 11 0 18 5 21 13z";

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 22,
  bevelEnabled: true,
  bevelThickness: 3,
  bevelSize: 2.2,
  bevelSegments: 5,
  curveSegments: 14,
};

/** Parse an SVG path string into extruded geometry, centred and Y-flipped. */
function buildGeometry(d: string): THREE.BufferGeometry {
  const loader = new SVGLoader();
  const { paths } = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  const shapes = paths.flatMap((p) => p.toShapes());
  const geometry = new THREE.ExtrudeGeometry(shapes, EXTRUDE);
  // SVG is y-down; flip and centre on the monogram's 256×256 artboard.
  geometry.scale(1, -1, 1);
  geometry.translate(-128, 128, -EXTRUDE.depth! / 2);
  geometry.computeVertexNormals();
  return geometry;
}

/** Remap UVs so a gradient texture spans the whole glyph diagonally. */
function remapUVs(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const size = new THREE.Vector3();
  box.getSize(size);
  const pos = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) - box.min.x) / size.x;
    const v = (pos.getY(i) - box.min.y) / size.y;
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}

/** Diagonal brand gradient as a texture (no network fetch). */
function makeGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 256, 256, 0);
  g.addColorStop(0, "#0A3DFF");
  g.addColorStop(0.45, "#12C8FF");
  g.addColorStop(0.7, "#FF5A0A");
  g.addColorStop(1, "#FFA31A");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

type FSLogoProps = {
  /** Pointer in normalised device coords, updated from the parent. */
  pointer: React.RefObject<THREE.Vector2>;
  reducedMotion?: boolean;
};

export function FSLogo({ pointer, reducedMotion = false }: FSLogoProps) {
  const group = React.useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const { fGeometry, sGeometry, gradient } = React.useMemo(() => {
    const f = buildGeometry(F_PATH);
    const s = buildGeometry(S_PATH);
    remapUVs(s);
    return { fGeometry: f, sGeometry: s, gradient: makeGradientTexture() };
  }, []);

  React.useEffect(() => {
    return () => {
      fGeometry.dispose();
      sGeometry.dispose();
      gradient.dispose();
    };
  }, [fGeometry, sGeometry, gradient]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const baseY = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.35;
    const baseX = reducedMotion ? 0 : Math.sin(t * 0.22) * 0.08;
    const targetY = baseY + pointer.current.x * 0.45;
    const targetX = baseX - pointer.current.y * 0.3;
    const ease = 1 - Math.pow(0.001, delta); // frame-rate independent damping
    g.rotation.y += (targetY - g.rotation.y) * ease * 0.9;
    g.rotation.x += (targetX - g.rotation.x) * ease * 0.9;
    g.position.y = reducedMotion ? 0 : Math.sin(t * 0.6) * 0.06;
  });

  // Scale the 256-unit artboard to roughly fill the viewport height.
  const scale = Math.min(viewport.width, viewport.height) / 300;

  return (
    <group ref={group} scale={scale}>
      {/* F — brushed silver */}
      <mesh geometry={fGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#e6e9ee"
          metalness={0.95}
          roughness={0.28}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* S — gradient glass */}
      <mesh geometry={sGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={gradient}
          emissiveMap={gradient}
          emissive="#ffffff"
          emissiveIntensity={0.4}
          metalness={0.35}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={1}
          envMapIntensity={1.4}
          sheen={0.4}
          sheenColor="#ffffff"
        />
      </mesh>
    </group>
  );
}
