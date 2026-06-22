"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

// Bloom makes the emissive accents read as "glow"; vignette frames the scene.
export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.9}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.25}
        radius={0.72}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  );
}
