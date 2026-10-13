"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SceneFrames, useSceneState } from "./scene-state";
import type { ResearchLayer } from "./research-map";

export type CorePose = { yaw: number; pitch: number };

const SECTIONS = 144;
const SIDES = 16;
const COLORS = ["#404a96", "#29558a", "#514299", "#38458a"];

/** Four connected surfaces: structure, folding, shared paths and an open horizon. */
function fieldPoint(u: number, v: number, layer: number) {
  const folds = [2, 3, 3, 2][layer];
  const depth = [0.18, 0.5, 0.7, 0.4][layer];
  const radius = 1.12 + [0.06, 0.2, 0.3, 0.2][layer] * Math.cos(u * folds);
  const twist = u * [1, 2, 2, 1][layer] + 0.5;
  const width = [0.34, 0.4, 0.32, 0.44][layer];
  const a = Math.cos(v) * width;
  const b = Math.sin(v) * 0.085;
  const radial = a * Math.cos(twist) - b * Math.sin(twist);
  const z = a * Math.sin(twist) + b * Math.cos(twist);
  return [
    Math.cos(u) * (radius + radial),
    Math.sin(u) * (radius + radial),
    depth * Math.sin(u * folds) + z,
  ];
}

function buildField() {
  const indices: number[] = [];
  for (let i = 0; i < SECTIONS; i++) {
    for (let j = 0; j < SIDES; j++) {
      const a = i * (SIDES + 1) + j;
      const b = a + SIDES + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const shapes = Array.from({ length: 4 }, (_, layer) => {
    const positions = new Float32Array((SECTIONS + 1) * (SIDES + 1) * 3);
    for (let i = 0; i <= SECTIONS; i++) {
      for (let j = 0; j <= SIDES; j++) {
        positions.set(fieldPoint(i / SECTIONS * Math.PI * 2, j / SIDES * Math.PI * 2, layer), (i * (SIDES + 1) + j) * 3);
      }
    }
    const shape = new THREE.BufferGeometry();
    shape.setIndex(indices);
    shape.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    shape.computeVertexNormals();
    return shape;
  });
  const geometry = shapes[0];
  // The same topology stays on the GPU as the chapter weights interpolate.
  geometry.morphAttributes.position = shapes.map(shape => shape.getAttribute("position"));
  geometry.morphAttributes.normal = shapes.map(shape => shape.getAttribute("normal"));
  geometry.computeBoundingSphere();
  shapes.slice(1).forEach(shape => shape.dispose());
  return geometry;
}

function ResearchField({ layer, pose, reduced }: {
  layer: ResearchLayer;
  pose: React.RefObject<CorePose>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const elapsed = useRef(0);
  const geometry = useMemo(() => buildField(), []);
  const colors = useMemo(() => COLORS.map(color => new THREE.Color(color)), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const blend = reduced ? 1 : 1 - Math.exp(-6 * step);
    if (!reduced) elapsed.current += step;
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pose.current.yaw, blend);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, pose.current.pitch, blend);
    }
    if (surface.current) {
      surface.current.rotation.z = -0.35 + (reduced ? 0 : Math.sin(elapsed.current * 0.15) * 0.08);
      const weights = surface.current.morphTargetInfluences;
      if (weights) {
        for (let i = 0; i < weights.length; i++) weights[i] = THREE.MathUtils.lerp(weights[i], i === layer ? 1 : 0, blend);
      }
    }
    if (material.current) material.current.color.lerp(colors[layer], blend);
  });

  return (
    <group ref={root} rotation={[0.15, 0, 0]}>
      <mesh ref={surface} args={[geometry]} rotation={[0.2, -0.5, -0.35]} frustumCulled={false}>
        <meshStandardMaterial ref={material} color={COLORS[1]} metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function OrbitalCoreScene({ layer, pose }: {
  layer: ResearchLayer;
  pose: React.RefObject<CorePose>;
}) {
  const { host, active, reduced } = useSceneState();
  const [mobile] = useState(() => window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches);
  return (
    <div ref={host} className="absolute inset-0" data-orbital-core="true" aria-hidden="true">
      <Canvas dpr={mobile ? 1 : [1, 1.5]} frameloop={!active ? "never" : mobile || reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "low-power" }} fallback={<div className="core-fallback" />}>
        <SceneFrames active={active} reduced={reduced} mobile={mobile} />
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#e8eaf6", "#070915", 1.3]} />
        <directionalLight position={[2, 3, 4]} color="#67e8f9" intensity={4} />
        <directionalLight position={[-3, 1, 2]} color="#c084fc" intensity={3} />
        <directionalLight position={[0, -3, -2]} color="#8b5cf6" intensity={3} />
        <ResearchField layer={layer} pose={pose} reduced={reduced} />
      </Canvas>
    </div>
  );
}
