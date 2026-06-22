"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Static set-dressing: a recognizable "home", a clear edge, and distant planets
// that act as a skybox focal point (fog disabled so they read like a backdrop).
export default function WorldExtras() {
  const ring = useRef<THREE.Mesh>(null);
  const planet = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.15;
    if (planet.current) planet.current.rotation.y += delta * 0.01;
  });

  return (
    <>
      {/* central landmark pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#0a0e14" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[4.4, 4.7, 80]} />
        <meshBasicMaterial color="#e8a26b" transparent opacity={0.6} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
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
        <meshBasicMaterial color="#33506e" transparent opacity={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* distant ringed gas giant */}
      <group ref={planet} position={[-150, 58, -190]}>
        <mesh>
          <sphereGeometry args={[46, 48, 48]} />
          <meshStandardMaterial color="#1b1633" emissive="#3a2a66" emissiveIntensity={0.7} roughness={1} fog={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, 0.4]}>
          <ringGeometry args={[60, 84, 96]} />
          <meshBasicMaterial color="#a98be8" transparent opacity={0.22} side={THREE.DoubleSide} toneMapped={false} fog={false} />
        </mesh>
      </group>

      {/* distant amber moon */}
      <mesh position={[130, 80, -150]}>
        <sphereGeometry args={[20, 36, 36]} />
        <meshStandardMaterial color="#2a1d14" emissive="#e8a26b" emissiveIntensity={0.5} roughness={1} fog={false} />
      </mesh>
    </>
  );
}
