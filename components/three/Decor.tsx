"use client";

import { Sparkles, Stars } from "@react-three/drei";

// Atmospheric neon dust + a faint hazy starfield above the city.
export default function Decor() {
  return (
    <>
      <Stars radius={180} depth={60} count={2200} factor={3} saturation={0} fade speed={0.3} />
      <Sparkles count={90} scale={[150, 30, 150]} size={2.4} speed={0.25} color="#00e5ff" opacity={0.5} />
      <Sparkles count={70} scale={[130, 24, 130]} size={3.2} speed={0.15} color="#ff2e88" opacity={0.4} />
    </>
  );
}
