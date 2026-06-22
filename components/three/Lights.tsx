"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <hemisphereLight args={["#223354", "#070710", 0.35]} />

      {/* dim cool moonlight with soft shadows */}
      <directionalLight
        position={[18, 42, 12]}
        intensity={0.55}
        color="#9fb2ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={130}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0004}
      />

      {/* neon city glow spilling onto the wet streets */}
      <pointLight position={[-34, 12, -10]} color="#ff2e88" intensity={70} distance={85} decay={2} />
      <pointLight position={[32, 12, 8]} color="#00e5ff" intensity={70} distance={85} decay={2} />
      <pointLight position={[0, 12, 40]} color="#b14bff" intensity={60} distance={85} decay={2} />
      <pointLight position={[8, 12, -42]} color="#ff9e2c" intensity={48} distance={85} decay={2} />
    </>
  );
}
