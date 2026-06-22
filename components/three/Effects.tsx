"use client";

import { EffectComposer, Bloom, Vignette, ChromaticAberration, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";

// Cinematic post stack: bloom drives the glow, a touch of chromatic aberration
// + vignette frames it, SMAA keeps edges crisp.
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.3} radius={0.85} />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0007, 0.0007)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.95} />
      <SMAA />
    </EffectComposer>
  );
}
