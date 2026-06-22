"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { carState } from "@/lib/carState";
import { ACCENT } from "@/lib/palette";

const RAMPS: { pos: [number, number]; yaw: number }[] = [
  { pos: [-22, 24], yaw: Math.PI * 0.25 },
  { pos: [26, -22], yaw: -Math.PI * 0.6 },
  { pos: [44, 34], yaw: Math.PI * 0.9 },
];
const R = 3.6;
const UP = 14;
const FWD = 6;
const COOLDOWN = 1.2;

// Drive onto a ramp with some speed → launch up + forward (vertical impulse
// bypasses the planar speed cap, so the car really pops into the air).
export default function JumpRamps() {
  const last = useRef<number[]>(RAMPS.map(() => -10));
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const body = carState.body;
    if (!body) return;
    const now = state.clock.elapsedTime;
    RAMPS.forEach((r, i) => {
      const dx = carState.position.x - r.pos[0];
      const dz = carState.position.z - r.pos[1];
      if (dx * dx + dz * dz < R * R && Math.abs(carState.speed) > 6 && now - last.current[i] > COOLDOWN) {
        last.current[i] = now;
        tmp.copy(carState.forward).multiplyScalar(FWD * Math.sign(carState.speed || 1));
        body.applyImpulse({ x: tmp.x, y: UP, z: tmp.z }, true);
      }
    });
  });

  return (
    <>
      {RAMPS.map((r, i) => (
        <group key={i} position={[r.pos[0], 0, r.pos[1]]} rotation={[0, r.yaw, 0]}>
          {/* glowing approach pad */}
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 4.4]} />
            <meshBasicMaterial
              color={ACCENT.violet}
              transparent
              opacity={0.22}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* kicker lip (visual) */}
          <mesh position={[0, 0.35, -1.8]} rotation={[-0.5, 0, 0]} castShadow>
            <boxGeometry args={[3.4, 0.7, 1.3]} />
            <meshStandardMaterial color="#0c0f18" metalness={0.5} roughness={0.4} emissive={ACCENT.violet} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.72, -2.3]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[3.5, 0.12, 0.3]} />
            <meshStandardMaterial color={ACCENT.violet} emissive={ACCENT.violet} emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}
