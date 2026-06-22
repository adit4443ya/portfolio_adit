"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import * as THREE from "three";
import type { Station as StationData } from "@/lib/data";
import { ACCENT } from "@/lib/palette";
import { useStore } from "@/lib/store";
import Emblem from "./Emblem";

export default function Station({ station }: { station: StationData }) {
  const color = ACCENT[station.accent];
  const ring = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const isNear = useStore((s) => s.nearbyId === station.id);

  useFrame((state, delta) => {
    const near = useStore.getState().nearbyId === station.id;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2 + station.position[0]) * 0.18;

    if (ring.current) {
      const target = near ? 1.18 : 1;
      ring.current.scale.x = THREE.MathUtils.damp(ring.current.scale.x, target, 6, delta);
      ring.current.scale.y = ring.current.scale.x;
    }
    if (glow.current) {
      glow.current.intensity = (near ? 20 : 8) * pulse;
    }
  });

  return (
    <group position={station.position}>
      {/* solid base you can bump into */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1.5, 1.2]} position={[0, 1.5, 0]} />
      </RigidBody>

      {/* hex pillar */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.25, 3, 6]} />
        <meshStandardMaterial color="#0d1118" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* emissive band near the top */}
      <mesh position={[0, 2.7, 0]}>
        <cylinderGeometry args={[1.13, 1.13, 0.18, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>

      {/* floating, kind-specific emblem */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[0, 0.5]}>
        <group position={[0, 4.8, 0]}>
          <Emblem kind={station.kind} color={color} />
        </group>
      </Float>
      <pointLight ref={glow} position={[0, 4.8, 0]} color={color} intensity={8} distance={14} decay={2} />

      {/* ground ring marking the zone */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[3.1, 3.45, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* floating name tag (non-interactive) */}
      <Html position={[0, 6.6, 0]} center distanceFactor={16} className="station-label" zIndexRange={[20, 0]}>
        <div className={`slab ${isNear ? "slab-on" : ""}`} style={{ ["--c" as string]: color }}>
          <span className="slab-code">{station.code}</span>
          <span className="slab-name">{station.label}</span>
        </div>
      </Html>
    </group>
  );
}
