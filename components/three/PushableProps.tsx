"use client";

import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { ACCENT } from "@/lib/palette";
import { stations } from "@/lib/data";

const NEONS = [ACCENT.rose, ACCENT.cyan, ACCENT.violet, ACCENT.amber];
const ST = stations.map((s) => [s.position[0], s.position[2]] as [number, number]);

function isClear(x: number, z: number) {
  if (Math.hypot(x, z) < 8) return false; // keep the plaza clear
  for (const [sx, sz] of ST) if (Math.hypot(x - sx, z - sz) < 6) return false;
  return true;
}

// Dynamic neon props you can ram and scatter around the streets.
export default function PushableProps() {
  const items = useMemo(() => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const out: { x: number; z: number; type: "orb" | "crate"; color: string; r: number }[] = [];
    let tries = 0;
    while (out.length < 16 && tries < 300) {
      tries++;
      const ang = rnd() * Math.PI * 2;
      const rad = 10 + rnd() * 44;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;
      if (!isClear(x, z)) continue;
      out.push({ x, z, type: rnd() > 0.5 ? "orb" : "crate", color: NEONS[out.length % 4], r: 0.7 + rnd() * 0.5 });
    }
    return out;
  }, []);

  return (
    <>
      {items.map((it, i) =>
        it.type === "orb" ? (
          <RigidBody
            key={i}
            colliders="ball"
            position={[it.x, 2, it.z]}
            restitution={0.65}
            friction={0.5}
            linearDamping={0.3}
            angularDamping={0.3}
          >
            <mesh castShadow>
              <sphereGeometry args={[it.r, 24, 24]} />
              <meshStandardMaterial
                color={it.color}
                emissive={it.color}
                emissiveIntensity={0.7}
                metalness={0.3}
                roughness={0.25}
                toneMapped={false}
              />
            </mesh>
          </RigidBody>
        ) : (
          <RigidBody
            key={i}
            colliders="cuboid"
            position={[it.x, 2, it.z]}
            restitution={0.3}
            friction={0.7}
            linearDamping={0.3}
            angularDamping={0.4}
          >
            <mesh castShadow>
              <boxGeometry args={[it.r * 1.5, it.r * 1.5, it.r * 1.5]} />
              <meshStandardMaterial color="#0c0f18" metalness={0.5} roughness={0.45} emissive={it.color} emissiveIntensity={0.35} />
            </mesh>
            <mesh>
              <boxGeometry args={[it.r * 1.54, it.r * 0.14, it.r * 1.54]} />
              <meshStandardMaterial color={it.color} emissive={it.color} emissiveIntensity={1.8} toneMapped={false} />
            </mesh>
          </RigidBody>
        )
      )}
    </>
  );
}
