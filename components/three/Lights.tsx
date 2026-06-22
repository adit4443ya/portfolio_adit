"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#3a4a66", "#05060a", 0.45]} />

      {/* warm key light with soft shadows */}
      <directionalLight
        position={[24, 36, 18]}
        intensity={1.35}
        color="#fff1df"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.0004}
      />

      {/* cool rim light from behind for separation */}
      <directionalLight position={[-20, 14, -28]} intensity={0.7} color="#76d4e0" />

      {/* faint accent fills for atmosphere */}
      <pointLight position={[-30, 10, 0]} color="#76d4e0" intensity={36} distance={70} decay={2} />
      <pointLight position={[28, 10, -10]} color="#e87b9b" intensity={32} distance={70} decay={2} />
      <pointLight position={[0, 14, 30]} color="#a98be8" intensity={30} distance={70} decay={2} />
    </>
  );
}
