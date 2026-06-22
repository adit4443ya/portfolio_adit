"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { carState } from "@/lib/carState";

const COUNT = 1400;
const AREA = 70; // half-width of the rain box that follows the car
const TOP = 45;

export default function Rain() {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * AREA * 2;
      positions[i * 3 + 1] = Math.random() * TOP;
      positions[i * 3 + 2] = (Math.random() - 0.5) * AREA * 2;
      speeds[i] = 32 + Math.random() * 30;
    }
    return { positions, speeds };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    if (group.current) {
      group.current.position.x = carState.position.x;
      group.current.position.z = carState.position.z;
    }
    const geo = points.current?.geometry;
    if (geo) {
      const arr = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] -= speeds[i] * dt;
        if (arr[i * 3 + 1] < 0) {
          arr[i * 3 + 1] = TOP;
          arr[i * 3] = (Math.random() - 0.5) * AREA * 2;
          arr[i * 3 + 2] = (Math.random() - 0.5) * AREA * 2;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9fdcff"
          size={0.16}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
