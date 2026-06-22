"use client";

import { useFrame } from "@react-three/fiber";
import { carState } from "@/lib/carState";
import { stations } from "@/lib/data";
import { useStore } from "@/lib/store";

const RADIUS_SQ = 7.5 * 7.5;

// Runs inside the canvas; each frame finds the closest station within range and
// updates the store (which only re-renders on an actual change).
export default function ProximityManager() {
  useFrame(() => {
    let bestId: string | null = null;
    let bestDist = RADIUS_SQ;

    for (const s of stations) {
      const dx = s.position[0] - carState.position.x;
      const dz = s.position[2] - carState.position.z;
      const d = dx * dx + dz * dz;
      if (d < bestDist) {
        bestDist = d;
        bestId = s.id;
      }
    }

    useStore.getState().setNearby(bestId);
  });

  return null;
}
