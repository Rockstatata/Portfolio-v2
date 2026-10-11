"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aRadius;
  attribute vec3 aOffset;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Differential rotation: inner arms orbit faster than the rim.
    float angle = atan(position.z, position.x);
    float spin = uTime * (0.9 / (aRadius + 0.6));
    angle += spin;
    vec3 p = vec3(cos(angle) * aRadius, position.y, sin(angle) * aRadius) + aOffset;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mv.z);

    vColor = color;
    vAlpha = smoothstep(0.0, 0.4, aRadius) * 0.35 + 0.65;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = pow(1.0 - clamp(d * 2.0, 0.0, 1.0), 3.2);
    if (strength < 0.01) discard;
    gl_FragColor = vec4(vColor * strength, strength * vAlpha);
  }
`;

function buildGalaxy(count: number) {
  const radius = 5.2;
  const branches = 4;
  const spinFactor = 1.15;
  const randomness = 0.42;
  const randomnessPower = 2.6;
  const inside = new THREE.Color("#ffd3a1");
  const middle = new THREE.Color("#c084fc");
  const outside = new THREE.Color("#38bdf8");

  const positions = new Float32Array(count * 3);
  const offsets = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const radii = new Float32Array(count);
  const mixed = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.7) * radius;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    const angle = branch + r * spinFactor;
    const scatter = () =>
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      (r * 0.6 + 0.35);

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = scatter() * 0.35;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    offsets[i * 3] = scatter();
    offsets[i * 3 + 1] = scatter() * 0.25;
    offsets[i * 3 + 2] = scatter();
    radii[i] = r;

    const t = r / radius;
    if (t < 0.35) mixed.copy(inside).lerp(middle, t / 0.35);
    else mixed.copy(middle).lerp(outside, (t - 0.35) / 0.65);
    // A few hot blue-white stars scattered through the arms.
    if (Math.random() < 0.015) mixed.set("#e0f2fe");
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;

    scales[i] = (t < 0.12 ? 1.6 : 1) * (0.4 + Math.random() * 0.9);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  g.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
  return g;
}

type GalaxyProps = { count: number };

function Galaxy({ count }: GalaxyProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => buildGalaxy(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 50 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [gl],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta * 0.32;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function GalaxyScene({
  progress,
}: {
  progress: React.RefObject<number>;
}) {
  const [count] = useState(() => {
    const small = window.matchMedia("(max-width: 768px)").matches;
    return small || (navigator.hardwareConcurrency ?? 4) <= 4 ? 12000 : 36000;
  });
  const [active, setActive] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", updateVisibility);
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      {
        threshold: 0,
      },
    );
    if (host.current) io.observe(host.current);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        frameloop={active && pageVisible ? "always" : "never"}
        dpr={[1, 1.25]}
        camera={{ position: [0, 5, 6.4], fov: 55, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <GalaxyGroup count={count} progress={progress} />
      </Canvas>
    </div>
  );
}

/** Mouse parallax plus a scroll-driven dive toward the core. */
function GalaxyGroup({
  count,
  progress,
}: {
  count: number;
  progress: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, size }, delta) => {
    const p = progress.current ?? 0;
    const wide = size.width > 900;
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.1));

    camera.position.x += (pointer.current.x * 0.6 - camera.position.x) * k;
    camera.position.y +=
      (5 - p * 3.4 - pointer.current.y * 0.4 - camera.position.y) * k;
    camera.position.z += (6.4 - p * 2.8 - camera.position.z) * k;
    camera.lookAt(0, 0, 0);

    const g = group.current;
    if (g) {
      const gx = wide ? 3.1 * (1 - p) : 0;
      g.position.x += (gx - g.position.x) * k;
      g.rotation.z = -0.2 + p * 0.25;
      g.rotation.x = 0.25;
    }
  });

  return (
    <group ref={group}>
      <Galaxy count={count} />
    </group>
  );
}
