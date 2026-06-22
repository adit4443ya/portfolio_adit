"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { carState } from "@/lib/carState";
import { ACCENT } from "@/lib/palette";

const PADS: [number, number][] = [
  [0, -36],
  [-36, 2],
  [36, 12],
  [12, 36],
];
const R = 4.5;
const FORCE = 64;

// Drive over a pad → forward impulse (and raise the speed cap via padBoost).
export default function BoostPads() {
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const body = carState.body;
    let on = false;
    if (body) {
      for (const [px, pz] of PADS) {
        const dx = carState.position.x - px;
        const dz = carState.position.z - pz;
        if (dx * dx + dz * dz < R * R) {
          on = true;
          tmp.copy(carState.forward).multiplyScalar(FORCE * dt);
          body.applyImpulse({ x: tmp.x, y: 0, z: tmp.z }, true);
          break;
        }
      }
    }
    carState.padBoost = on;
  });

  return (
    <>
      {PADS.map(([x, z], i) => (
        <group key={i} position={[x, 0.06, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[R, 48]} />
            <meshBasicMaterial
              color={ACCENT.cyan}
              transparent
              opacity={0.18}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[R - 0.5, R - 0.15, 48]} />
            <meshBasicMaterial color={ACCENT.cyan} transparent opacity={0.8} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  );
}
