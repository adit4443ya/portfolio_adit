"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, KeyboardControls, Preload } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { BG } from "@/lib/palette";
import { useIsTouch } from "@/hooks/useIsTouch";
import Lights from "./three/Lights";
import Ground from "./three/Ground";
import Rover from "./three/Rover";
import Stations from "./three/Stations";
import ProximityManager from "./three/ProximityManager";
import FollowCamera from "./three/FollowCamera";
import Decor from "./three/Decor";
import WorldExtras from "./three/WorldExtras";
import Effects from "./three/Effects";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "brake", keys: ["Space"] },
  { name: "boost", keys: ["ShiftLeft", "ShiftRight"] },
];

export default function Experience() {
  const isTouch = useIsTouch();

  return (
    <KeyboardControls map={keyMap}>
      <Canvas
        shadows
        dpr={[1, isTouch ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 7, 22], fov: 50, near: 0.1, far: 320 }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 38, 120]} />

        <Suspense fallback={null}>
          <Lights />
          <Physics gravity={[0, -26, 0]}>
            <Ground />
            <Rover />
            <Stations />
            <ProximityManager />
          </Physics>
          <Decor />
          <WorldExtras />
          <Effects />
          <Preload all />
        </Suspense>

        <FollowCamera />
        <AdaptiveDpr pixelated />
      </Canvas>
    </KeyboardControls>
  );
}
