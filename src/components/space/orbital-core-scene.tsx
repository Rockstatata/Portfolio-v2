"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneFrames, useSceneState } from "./scene-state";
import type { ResearchLayer } from "./research-map";

export type CorePose = { yaw: number; pitch: number };

const MATERIALS = {
  ceramic: "#e5ded1",
  graphite: "#303947",
  copper: "#bb8057",
  silicon: "#384e65",
  green: "#80988c",
};

function Block({ size, position = [0, 0, 0], color = MATERIALS.graphite, metal = false }: {
  size: [number, number, number];
  position?: [number, number, number];
  color?: string;
  metal?: boolean;
}) {
  return (
    <RoundedBox args={size} position={position} radius={Math.min(...size) * 0.18} smoothness={2} bevelSegments={2}>
      <meshStandardMaterial color={color} metalness={metal ? 0.65 : 0.15} roughness={metal ? 0.32 : 0.55} />
    </RoundedBox>
  );
}

/** Stacked, finished modules give software a tangible foundation. */
function Foundation() {
  return (
    <group rotation={[0, -0.2, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[i * 0.12 - 0.12, i * 0.42 - 0.5, 0]}>
          <Block size={[2.15, 0.3, 1.6]} color={i === 1 ? MATERIALS.copper : MATERIALS.ceramic} />
          <Block size={[1.9, 0.07, 1.36]} position={[0, -0.17, 0]} />
          {[0, 1, 2].map((port) => (
            <Block key={port} size={[0.28, 0.09, 0.035]} position={[port * 0.4 - 0.4, 0, 0.8]} />
          ))}
          <mesh position={[0.8, 0, 0.817]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
            <meshStandardMaterial color={MATERIALS.green} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A chip package with physical pins, substrate and a tiled silicon die. */
function Compute({ compact = false }: { compact?: boolean }) {
  return (
    <group scale={compact ? 0.62 : 1}>
      <Block size={[2, 0.18, 2]} color={MATERIALS.graphite} position={[0, -0.12, 0]} />
      <Block size={[1.55, 0.1, 1.55]} color={MATERIALS.copper} metal />
      <Block size={[1.34, 0.15, 1.34]} color={MATERIALS.ceramic} position={[0, 0.12, 0]} />
      {Array.from({ length: 16 }, (_, i) => (
        <Block key={i} size={[0.24, 0.05, 0.24]} position={[(i % 4 - 1.5) * 0.29, 0.22, (Math.floor(i / 4) - 1.5) * 0.29]} color={MATERIALS.silicon} metal />
      ))}
      {[0, 1, 2, 3].map((side) => (
        <group key={side} rotation={[0, side * Math.PI / 2, 0]}>
          {Array.from({ length: 8 }, (_, i) => (
            <Block key={i} size={[0.085, 0.05, 0.23]} position={[(i - 3.5) * 0.2, -0.13, 1.03]} color={MATERIALS.copper} metal />
          ))}
        </group>
      ))}
    </group>
  );
}

function Robot({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[0.56, 0.42, 0.45]} position={[0, 0.24, 0]} color={MATERIALS.ceramic} />
      <Block size={[0.5, 0.08, 0.4]} position={[0, 0.05, 0]} color={MATERIALS.green} />
      <Block size={[0.47, 0.29, 0.35]} position={[0, 0.64, 0]} color={MATERIALS.ceramic} />
      <Block size={[0.34, 0.12, 0.04]} position={[0, 0.65, 0.18]} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.09, 0.65, 0.205]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#d4dccc" emissive="#80988c" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[side * 0.3, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.1, 20]} />
            <meshStandardMaterial color={MATERIALS.graphite} roughness={0.8} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.18, 10]} />
        <meshStandardMaterial color={MATERIALS.copper} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Three robots and their shared compute form one grounded composition. */
function Collaboration() {
  return (
    <group position={[0, -0.3, 0]}>
      <Block size={[2.9, 0.12, 2.3]} color={MATERIALS.graphite} position={[0, -0.12, 0]} />
      <group position={[0, 0.1, 0]}><Compute compact /></group>
      <Robot position={[-1.05, 0, 0.55]} rotation={0.35} />
      <Robot position={[1.05, 0, 0.55]} rotation={-0.35} />
      <Robot position={[0, 0, -0.85]} rotation={0} />
    </group>
  );
}

/** Space is represented by the technology I aspire to work on. */
function Satellite() {
  return (
    <group rotation={[0.12, 0, -0.16]}>
      <Block size={[0.7, 0.8, 0.7]} color={MATERIALS.ceramic} />
      <Block size={[0.75, 0.12, 0.75]} position={[0, -0.4, 0]} color={MATERIALS.copper} metal />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.04, 0, 0]}>
          <Block size={[0.7, 0.06, 0.12]} position={[-side * 0.46, 0, 0]} color={MATERIALS.copper} metal />
          <Block size={[1.06, 0.08, 1.4]} color={MATERIALS.graphite} />
          {Array.from({ length: 12 }, (_, i) => (
            <Block key={i} size={[0.28, 0.025, 0.28]} position={[(i % 3 - 1) * 0.33, 0.06, (Math.floor(i / 3) - 1.5) * 0.33]} color={MATERIALS.silicon} metal />
          ))}
        </group>
      ))}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
        <meshStandardMaterial color={MATERIALS.copper} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.74, 0]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.3, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.38]} />
        <meshStandardMaterial color={MATERIALS.ceramic} side={THREE.DoubleSide} metalness={0.3} roughness={0.45} />
      </mesh>
    </group>
  );
}

function ResearchMap({ layer, pose, reduced }: {
  layer: ResearchLayer;
  pose: React.RefObject<CorePose>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    if (!reduced) time.current += step;
    if (!root.current) return;
    const blend = reduced ? 1 : 1 - Math.exp(-8 * step);
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pose.current.yaw, blend);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, pose.current.pitch, blend);
    root.current.position.y = reduced ? 0 : Math.sin(time.current * 0.65) * 0.035;
  });
  return (
    <group ref={root}>
      {layer === 0 && <Foundation />}
      {layer === 1 && <Compute />}
      {layer === 2 && <Collaboration />}
      {layer === 3 && <Satellite />}
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
        camera={{ position: [3.6, 2.8, 5.8], fov: 36 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} fallback={<div className="core-fallback" />}>
        <SceneFrames active={active} reduced={reduced} mobile={mobile} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#eae3d6", "#343a50", 2]} />
        <directionalLight position={[3, 5, 4]} color="#fff0d9" intensity={3.5} />
        <directionalLight position={[-4, 1, -2]} color="#9bafc6" intensity={2} />
        <ResearchMap layer={layer} pose={pose} reduced={reduced} />
      </Canvas>
    </div>
  );
}
