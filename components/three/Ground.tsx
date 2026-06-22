"use client";

import { Grid, MeshReflectorMaterial } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

// The wet neon street: a fixed physics body (floor slab + perimeter walls) plus
// a highly reflective surface that mirrors the city lights, and a faint grid.
export default function Ground() {
  return (
    <>
      <RigidBody type="fixed" colliders={false} friction={1}>
        <CuboidCollider args={[80, 0.5, 80]} position={[0, -0.5, 0]} />
        <CuboidCollider args={[80, 6, 1]} position={[0, 6, -78]} />
        <CuboidCollider args={[80, 6, 1]} position={[0, 6, 78]} />
        <CuboidCollider args={[1, 6, 80]} position={[-78, 6, 0]} />
        <CuboidCollider args={[1, 6, 80]} position={[78, 6, 0]} />
      </RigidBody>

      {/* wet reflective asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.8}
          blur={[320, 90]}
          mixBlur={1}
          mixStrength={3.2}
          depthScale={1.0}
          minDepthThreshold={0.2}
          maxDepthThreshold={1.2}
          color="#05060c"
          metalness={0.9}
          roughness={0.42}
        />
      </mesh>

      {/* faint street grid */}
      <Grid
        position={[0, 0.012, 0]}
        infiniteGrid
        cellSize={2.5}
        cellThickness={0.5}
        cellColor="#0e1b26"
        sectionSize={12.5}
        sectionThickness={1}
        sectionColor="#1d3550"
        fadeDistance={120}
        fadeStrength={2.4}
      />
    </>
  );
}
