"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { StationKind } from "@/lib/data";

// A distinct, animated procedural motif per sector kind. All emissive so they
// catch the bloom pass. Geometry only — no external assets.
export default function Emblem({ kind, color }: { kind: StationKind; color: string }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const bars = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (root.current) root.current.rotation.y += delta * 0.5;
    if (spin.current) spin.current.rotation.y -= delta * 0.9;
    if (bars.current) {
      bars.current.children.forEach((b, i) => {
        const h = 0.5 + (Math.sin(t * 2 + i) * 0.5 + 0.5) * 1.1;
        b.scale.y = h;
        b.position.y = h / 2;
      });
    }
    if (rings.current) {
      rings.current.children.forEach((r, i) => {
        const s = 0.5 + ((t * 0.5 + i * 0.33) % 1) * 1.4;
        r.scale.setScalar(s);
        const m = (r as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m) m.opacity = 1 - ((t * 0.5 + i * 0.33) % 1);
      });
    }
  });

  const mat = (extra?: Partial<THREE.MeshStandardMaterialParameters>) => (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.9}
      metalness={0.3}
      roughness={0.18}
      toneMapped={false}
      {...extra}
    />
  );

  switch (kind) {
    case "profile":
      return (
        <group ref={root}>
          <mesh>
            <icosahedronGeometry args={[0.6, 0]} />
            {mat()}
          </mesh>
          <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <torusGeometry args={[1.1, 0.05, 12, 48]} />
            {mat()}
          </mesh>
        </group>
      );

    case "trajectory":
      return (
        <group ref={root}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[(i - 1) * 0.7, (i - 1) * 0.55, 0]}>
              <sphereGeometry args={[0.26 + i * 0.05, 20, 20]} />
              {mat()}
            </mesh>
          ))}
        </group>
      );

    case "work":
      return (
        <group ref={root}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.95, 0.06, 12, 48]} />
            {mat()}
          </mesh>
          <group ref={spin}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.65, 0.06, 12, 48]} />
              {mat()}
            </mesh>
          </group>
          <mesh>
            <octahedronGeometry args={[0.34, 0]} />
            {mat()}
          </mesh>
        </group>
      );

    case "research":
      return (
        <group ref={root}>
          <mesh>
            <sphereGeometry args={[0.34, 20, 20]} />
            {mat()}
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            const x = Math.cos(a) * 1.0;
            const z = Math.sin(a) * 1.0;
            return (
              <group key={i}>
                <mesh position={[x, 0, z]}>
                  <sphereGeometry args={[0.16, 16, 16]} />
                  {mat()}
                </mesh>
                <mesh position={[x / 2, 0, z / 2]} rotation={[0, -a, Math.PI / 2]}>
                  <cylinderGeometry args={[0.02, 0.02, 1.0, 6]} />
                  {mat({ emissiveIntensity: 1.1 })}
                </mesh>
              </group>
            );
          })}
        </group>
      );

    case "projects":
      return (
        <group ref={root}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, (i - 1) * 0.5, 0]} rotation={[0, i * 0.5, 0]}>
              <boxGeometry args={[0.95 - i * 0.12, 0.36, 0.95 - i * 0.12]} />
              {mat()}
            </mesh>
          ))}
        </group>
      );

    case "stack":
      return (
        <group ref={bars} position={[-0.8, 0, 0]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[i * 0.4, 0.5, 0]}>
              <boxGeometry args={[0.24, 1, 0.24]} />
              {mat()}
            </mesh>
          ))}
        </group>
      );

    case "contact":
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.28, 20, 20]} />
            {mat()}
          </mesh>
          <group ref={rings}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.8, 0.04, 10, 48]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={1.6}
                  transparent
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        </group>
      );

    default:
      return (
        <mesh ref={root as never}>
          <octahedronGeometry args={[0.9, 0]} />
          {mat()}
        </mesh>
      );
  }
}
