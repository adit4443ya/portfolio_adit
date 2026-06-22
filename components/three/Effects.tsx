"use client";

import { EffectComposer, Bloom, Vignette, ChromaticAberration, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";

// Cyberpunk post stack: heavy bloom for neon, chromatic aberration for the
// lens-y look, vignette + SMAA to finish.
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={1.35} luminanceThreshold={0.45} luminanceSmoothing={0.3} radius={0.88} />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0011, 0.0011)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.18} darkness={1.0} />
      <SMAA />
    </EffectComposer>
  );
}
