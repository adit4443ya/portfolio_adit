"use client";

import { useMemo } from "react";
import { Sparkles, Stars } from "@react-three/drei";

export default function Decor() {
  // Deterministic asteroid field scattered in a ring outside the station cluster.
  const rocks = useMemo(() => {
    let seed = 1337;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    return Array.from({ length: 20 }, () => {
      const ang = rnd() * Math.PI * 2;
      const rad = 42 + rnd() * 30;
      const s = 1.2 + rnd() * 3.2;
      return {
        pos: [Math.cos(ang) * rad, s * 0.35, Math.sin(ang) * rad] as [number, number, number],
        rot: [rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI] as [number, number, number],
        scale: s,
        detail: rnd() > 0.5 ? 1 : 0,
      };
    });
  }, []);

  return (
    <>
      <Stars radius={160} depth={80} count={6000} factor={4.5} saturation={0} fade speed={0.4} />
      {/* two drifting particle layers for atmosphere */}
      <Sparkles count={80} scale={[140, 16, 140]} size={2.6} speed={0.3} color="#e8a26b" opacity={0.5} />
      <Sparkles count={60} scale={[120, 22, 120]} size={3.4} speed={0.18} color="#76d4e0" opacity={0.4} />

      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={r.rot} scale={r.scale} castShadow receiveShadow>
          <icosahedronGeometry args={[1, r.detail]} />
          <meshStandardMaterial color="#0b0e14" metalness={0.6} roughness={0.7} flatShading />
        </mesh>
      ))}
    </>
  );
}
