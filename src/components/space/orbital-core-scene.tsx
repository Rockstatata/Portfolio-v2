"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneFrames, useSceneState } from "./scene-state";
import { RESEARCH_LAYERS, type ResearchLayer } from "./research-map";

export type CorePose = { yaw: number; pitch: number };
const ROBOTS = Array.from({ length: 3 }, (_, i) => {
  const angle = (i / 3) * Math.PI * 2;
  return [Math.cos(angle) * 1.7, Math.sin(angle) * 1.7, 0] as [number, number, number];
});

function ResearchMap({ layer, pose, reduced }: {
  layer: ResearchLayer;
  pose: React.RefObject<CorePose>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const collaboration = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    if (!reduced) time.current += step;
    if (root.current) {
      const blend = reduced ? 1 : 1 - Math.exp(-8 * step);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pose.current.yaw, blend);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, pose.current.pitch, blend);
    }
    if (collaboration.current) collaboration.current.rotation.z = time.current * 0.08;
  });
  const opacity = (index: number) => layer === index ? 0.95 : 0.18;
  return (
    <group ref={root}>
      {/* The software foundation surrounds the compute tile. */}
      <mesh rotation={[0.3, 0.2, 0.2]}>
        <boxGeometry args={[1.55, 1.55, 0.65]} />
        <meshBasicMaterial color={RESEARCH_LAYERS[0].color} wireframe transparent opacity={opacity(0)} />
      </mesh>
      {/* A 4 × 4 compute tile, without invented throughput telemetry. */}
      <group rotation={[0.3, 0.2, 0.2]}>
        <mesh><boxGeometry args={[1.22, 1.22, 0.22]} /><meshStandardMaterial color="#152339" metalness={0.65} roughness={0.4} /></mesh>
        {Array.from({ length: 16 }, (_, i) => (
          <mesh key={i} position={[(i % 4 - 1.5) * 0.27, (Math.floor(i / 4) - 1.5) * 0.27, 0.14]}>
            <boxGeometry args={[0.19, 0.19, 0.04]} />
            <meshBasicMaterial color={RESEARCH_LAYERS[1].color} transparent opacity={opacity(1)} />
          </mesh>
        ))}
      </group>
      {/* Three peers share an orbit and connections to the central knowledge. */}
      <group rotation={[0.65, -0.35, 0]}>
        <group ref={collaboration}>
          <mesh><torusGeometry args={[1.7, 0.014, 6, 96]} /><meshBasicMaterial color={RESEARCH_LAYERS[2].color} transparent opacity={opacity(2)} /></mesh>
          {ROBOTS.map((position, i) => (
            <group key={i} position={position}>
              <mesh><boxGeometry args={[0.23, 0.18, 0.18]} /><meshBasicMaterial color={RESEARCH_LAYERS[2].color} transparent opacity={opacity(2)} /></mesh>
              <mesh position={[0, 0.14, 0]}><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color={RESEARCH_LAYERS[2].color} transparent opacity={opacity(2)} /></mesh>
              <mesh position={[-position[0] / 2, -position[1] / 2, 0]} rotation={[0, 0, i * Math.PI * 2 / 3 - Math.PI / 2]}>
                <boxGeometry args={[0.009, 1.7, 0.009]} /><meshBasicMaterial color={RESEARCH_LAYERS[2].color} transparent opacity={opacity(2) * 0.35} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
      {/* The broken outer orbit represents an ambition still being built. */}
      <group rotation={[-0.4, 0.45, 0]}>
        {Array.from({ length: 32 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, i * Math.PI * 2 / 32]}>
            <torusGeometry args={[2.2, 0.012, 5, 8, Math.PI * 2 / 48]} />
            <meshBasicMaterial color={RESEARCH_LAYERS[3].color} transparent opacity={opacity(3)} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0, 2]} color={RESEARCH_LAYERS[layer].color} intensity={5} />
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
        camera={{ position: [0, 0, 6.5], fov: 48 }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "low-power" }} fallback={<div className="core-fallback" />}>
        <SceneFrames active={active} reduced={reduced} mobile={mobile} />
        <ambientLight intensity={1.4} />
        <pointLight position={[3, 3, 4]} color="#e7c79a" intensity={20} />
        <ResearchMap layer={layer} pose={pose} reduced={reduced} />
      </Canvas>
    </div>
  );
}
