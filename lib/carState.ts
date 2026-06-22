import * as THREE from "three";
import type { RapierRigidBody } from "@react-three/rapier";

// A tiny module-level singleton shared between the rover (writer) and the
// follow-camera / proximity manager / boost pads / jump ramps.
export const carState = {
  position: new THREE.Vector3(0, 0.6, 8),
  forward: new THREE.Vector3(0, 0, -1),
  speed: 0,
  boosting: false,
  padBoost: false,
  body: null as RapierRigidBody | null,
};

export const SPAWN: [number, number, number] = [0, 1.2, 8];
