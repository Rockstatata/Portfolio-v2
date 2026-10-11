"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneFrames, useSceneState } from "./scene-state";

export type CorePose = { yaw: number; pitch: number };
const SATELLITES = Array.from({ length: 9 }, (_, i) => {
  const angle = (i / 9) * Math.PI * 2;
  return [
    Math.cos(angle) * 2,
    Math.sin(angle * 2) * 0.35,
    Math.sin(angle) * 2,
  ] as [number, number, number];
});

function Reactor({
  warp,
  pose,
  reduced,
}: {
  warp: boolean;
  pose: React.RefObject<CorePose>;
  reduced: boolean;
}) {
  const outer = useRef<THREE.Group>(null);
  const engine = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    if (!reduced) time.current += step * (warp ? 2.2 : 0.4);
    if (outer.current) {
      outer.current.rotation.y = THREE.MathUtils.lerp(
        outer.current.rotation.y,
        pose.current.yaw,
        reduced ? 1 : 0.15,
      );
      outer.current.rotation.x = THREE.MathUtils.lerp(
        outer.current.rotation.x,
        pose.current.pitch,
        reduced ? 1 : 0.15,
      );
      outer.current.position.y = reduced ? 0 : Math.sin(time.current) * 0.12;
    }
    if (engine.current) {
      engine.current.rotation.y = time.current;
      engine.current.rotation.z = time.current * 0.3;
      engine.current.scale.setScalar(
        warp && !reduced ? 1 + Math.sin(time.current * 3) * 0.04 : 1,
      );
    }
    if (ring.current) ring.current.rotation.y = -time.current * 0.55;
  });
  const color = warp ? "#c084fc" : "#67e8f9";
  return (
    <group ref={outer}>
      <group ref={engine}>
        <mesh>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial
            color="#0d1830"
            metalness={0.75}
            roughness={0.25}
            emissive={color}
            emissiveIntensity={warp ? 0.3 : 0.12}
          />
        </mesh>
        <mesh scale={1.025}>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshBasicMaterial
            wireframe
            color={color}
            transparent
            opacity={0.65}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.38]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      <group ref={ring}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[Math.PI / 2 + i * 0.65, i * 0.7, i * 0.5]}>
            <mesh>
              <torusGeometry args={[1.4 + i * 0.23, 0.018, 6, 96]} />
              <meshBasicMaterial
                color={i === 1 ? "#c084fc" : color}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[1.4 + i * 0.23, 0, 0]}>
              <sphereGeometry args={[0.085, 12, 12]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        ))}
        {SATELLITES.map((position, i) => (
          <mesh key={i} position={position}>
            <octahedronGeometry args={[0.045]} />
            <meshBasicMaterial color={i % 2 ? "#c084fc" : "#67e8f9"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function OrbitalCoreScene({
  warp,
  pose,
}: {
  warp: boolean;
  pose: React.RefObject<CorePose>;
}) {
  const { host, active, reduced } = useSceneState();
  const [mobile] = useState(
    () => window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches,
  );
  return (
    <div ref={host} className="absolute inset-0" data-orbital-core="true">
      <Canvas
        dpr={mobile ? 1 : [1, 1.5]}
        frameloop={!active ? "never" : mobile || reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 5.8], fov: 48 }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "low-power" }}
        fallback={<div className="core-fallback" />}
      >
        <SceneFrames active={active} reduced={reduced} mobile={mobile} />
        <ambientLight intensity={1.4} />
        <pointLight position={[3, 3, 4]} color="#67e8f9" intensity={30} />
        <pointLight position={[-3, -1, 2]} color="#c084fc" intensity={20} />
        <Reactor warp={warp} pose={pose} reduced={reduced} />
      </Canvas>
    </div>
  );
}
