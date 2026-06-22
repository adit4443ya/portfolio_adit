"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT } from "@/lib/palette";

// Central neon plaza landmark + a clear world boundary ring.
export default function WorldExtras() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.2;
  });

  return (
    <>
      {/* central plaza pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#0a0d15" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[4.6, 5.0, 96]} />
        <meshBasicMaterial color={ACCENT.cyan} transparent opacity={0.7} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* central holo light pillar */}
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.6, 0.2, 32, 16, 1, true]} />
        <meshBasicMaterial
          color={ACCENT.cyan}
          transparent
          opacity={0.08}
          toneMapped={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* boundary ring at the world edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[75.5, 76.5, 160]} />
        <meshBasicMaterial color={ACCENT.rose} transparent opacity={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
