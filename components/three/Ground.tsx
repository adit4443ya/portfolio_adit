"use client";

import { Grid } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

// The floor: a fixed physics body (floor slab + perimeter walls) plus the
// visual disc and the signature "observatory" grid.
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

      {/* visual floor disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[120, 96]} />
        <meshStandardMaterial color="#080a0f" metalness={0.55} roughness={0.65} />
      </mesh>

      {/* cosmic grid */}
      <Grid
        position={[0, 0.01, 0]}
        infiniteGrid
        cellSize={2}
        cellThickness={0.55}
        cellColor="#16202c"
        sectionSize={10}
        sectionThickness={1.1}
        sectionColor="#2c4156"
        fadeDistance={130}
        fadeStrength={2.2}
      />
    </>
  );
}
