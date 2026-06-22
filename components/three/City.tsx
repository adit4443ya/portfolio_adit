"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { ACCENT } from "@/lib/palette";

const NEONS = [ACCENT.rose, ACCENT.cyan, ACCENT.violet, ACCENT.amber];

export default function City() {
  // Backdrop skyline ring (outside the play area, no colliders).
  const backdrop = useMemo(() => {
    let seed = 99;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const count = 40;
    return Array.from({ length: count }, (_, i) => {
      const ang = (i / count) * Math.PI * 2 + rnd() * 0.05;
      const rad = 90 + rnd() * 55;
      const w = 7 + rnd() * 9;
      const d = 7 + rnd() * 9;
      const h = 22 + rnd() * 66;
      return {
        pos: [Math.cos(ang) * rad, h / 2, Math.sin(ang) * rad] as [number, number, number],
        size: [w, h, d] as [number, number, number],
        color: NEONS[i % NEONS.length],
      };
    });
  }, []);

  // In-play blocks you weave around (with colliders), kept clear of stations.
  const blocks = useMemo(
    () =>
      (
        [
          { pos: [-50, -10], size: [8, 16, 8] },
          { pos: [50, -26], size: [7, 12, 10] },
          { pos: [-44, 46], size: [9, 20, 9] },
          { pos: [46, 42], size: [8, 14, 8] },
          { pos: [14, -56], size: [7, 11, 7] },
          { pos: [-14, 56], size: [8, 18, 8] },
          { pos: [58, 6], size: [7, 13, 7] },
          { pos: [-58, -6], size: [8, 15, 8] },
        ] as { pos: [number, number]; size: [number, number, number] }[]
      ).map((b, i) => ({ ...b, color: NEONS[i % NEONS.length] })),
    []
  );

  return (
    <>
      {/* backdrop skyline */}
      {backdrop.map((b, i) => (
        <group key={i} position={b.pos}>
          <mesh castShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color="#080a12" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, b.size[1] / 2 - 1, 0]}>
            <boxGeometry args={[b.size[0] * 1.02, 0.6, b.size[2] * 1.02]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, -b.size[2] / 2 - 0.02]}>
            <boxGeometry args={[0.5, b.size[1] * 0.8, 0.1]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* in-play blocks with colliders */}
      {blocks.map((b, i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={[b.pos[0], b.size[1] / 2, b.pos[1]]}>
          <CuboidCollider args={[b.size[0] / 2, b.size[1] / 2, b.size[2] / 2]} />
          <mesh castShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color="#0a0c14" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0, -b.size[1] / 2 + 0.5, 0]}>
            <boxGeometry args={[b.size[0] * 1.04, 0.25, b.size[2] * 1.04]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
          <mesh position={[0, b.size[1] / 2 - 0.7, 0]}>
            <boxGeometry args={[b.size[0] * 1.04, 0.4, b.size[2] * 1.04]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
        </RigidBody>
      ))}

      {/* holographic billboards */}
      {(
        [
          { pos: [-30, 16, -52], rot: [0, 0.5, 0], color: ACCENT.cyan },
          { pos: [42, 20, -32], rot: [0, -0.6, 0], color: ACCENT.rose },
          { pos: [-48, 18, 34], rot: [0, 0.8, 0], color: ACCENT.violet },
        ] as { pos: [number, number, number]; rot: [number, number, number]; color: string }[]
      ).map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot}>
          <planeGeometry args={[14, 8]} />
          <meshBasicMaterial
            color={b.color}
            transparent
            opacity={0.16}
            toneMapped={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* distant megastructure: a giant neon ring on the horizon */}
      <mesh position={[-120, 72, -210]} rotation={[0.3, 0.4, 0]}>
        <torusGeometry args={[62, 2, 16, 90]} />
        <meshBasicMaterial color={ACCENT.cyan} toneMapped={false} fog={false} />
      </mesh>
    </>
  );
}
