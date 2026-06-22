"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Static set-dressing that gives the world a recognizable "home" and a clear edge.
export default function WorldExtras() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.15;
  });

  return (
    <>
      {/* central landmark pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#0a0e14" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[4.4, 4.7, 80]} />
        <meshBasicMaterial color="#e8a26b" transparent opacity={0.6} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* a soft light beam marking the centre */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 24, 12]} />
        <meshBasicMaterial
          color="#e8a26b"
          transparent
          opacity={0.1}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* boundary ring at the world edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[71.5, 72.5, 128]} />
        <meshBasicMaterial color="#2c4156" transparent opacity={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
