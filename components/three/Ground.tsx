"use client";

import { Grid, MeshReflectorMaterial } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

// The floor: a fixed physics body (floor slab + perimeter walls) plus a glossy
// reflective surface and the signature "observatory" grid on top.
export default function Ground() {
  return (
    <>
      {/* physics */}
      <RigidBody type="fixed" colliders={false} friction={1}>
        {/* floor slab — top surface sits at y = 0 */}
        <CuboidCollider args={[80, 0.5, 80]} position={[0, -0.5, 0]} />
        {/* invisible perimeter walls so you can't drive off into the void */}
        <CuboidCollider args={[80, 6, 1]} position={[0, 6, -78]} />
        <CuboidCollider args={[80, 6, 1]} position={[0, 6, 78]} />
        <CuboidCollider args={[1, 6, 80]} position={[-78, 6, 0]} />
        <CuboidCollider args={[1, 6, 80]} position={[78, 6, 0]} />
      </RigidBody>

      {/* glossy reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.45}
          blur={[400, 120]}
          mixBlur={1.2}
          mixStrength={2.4}
          depthScale={1.1}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.4}
          color="#070a10"
          metalness={0.7}
          roughness={0.85}
        />
      </mesh>

      {/* cosmic grid */}
      <Grid
        position={[0, 0.012, 0]}
        infiniteGrid
        cellSize={2}
        cellThickness={0.5}
        cellColor="#16202c"
        sectionSize={10}
        sectionThickness={1.1}
        sectionColor="#33506e"
        fadeDistance={130}
        fadeStrength={2.2}
      />
    </>
  );
}
