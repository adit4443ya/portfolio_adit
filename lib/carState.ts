import * as THREE from "three";

// A tiny module-level singleton shared between the rover (writer) and the
// follow-camera / proximity manager (readers). Avoids prop-drilling refs through
// the scene graph for a value that updates every frame.
export const carState = {
  position: new THREE.Vector3(0, 0.6, 8),
  forward: new THREE.Vector3(0, 0, -1),
  speed: 0,
  boosting: false,
};

export const SPAWN: [number, number, number] = [0, 1.2, 8];
