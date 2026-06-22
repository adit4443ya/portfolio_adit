"use client";

import { useMemo } from "react";
import { Sparkles, Stars } from "@react-three/drei";

export default function Decor() {
  // Deterministic asteroid field scattered in a ring outside the station cluster.
  const rocks = useMemo(() => {
    let seed = 1337;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    return Array.from({ length: 16 }, () => {
      const ang = rnd() * Math.PI * 2;
      const rad = 42 + rnd() * 30;
      const s = 1.2 + rnd() * 3;
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
      <Stars radius={150} depth={70} count={4500} factor={4} saturation={0} fade speed={0.4} />
      <Sparkles count={70} scale={[130, 14, 130]} size={2.5} speed={0.3} color="#e8a26b" opacity={0.5} />

      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={r.rot} scale={r.scale} castShadow receiveShadow>
          <icosahedronGeometry args={[1, r.detail]} />
          <meshStandardMaterial color="#0b0e14" metalness={0.6} roughness={0.7} flatShading />
        </mesh>
      ))}
    </>
  );
}
