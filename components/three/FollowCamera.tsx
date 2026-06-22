"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { carState } from "@/lib/carState";

const desired = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

// A smoothed chase camera that trails the rover from behind and slightly above.
export default function FollowCamera() {
  const curLook = useRef(new THREE.Vector3(0, 0, -16));

  useFrame((state, delta) => {
    // Position: trail behind the heading, low and back for a dramatic chase.
    desired.copy(carState.forward).multiplyScalar(-11).add(carState.position);
    desired.y = carState.position.y + 5.2;

    // Aim ahead of the rover.
    lookTarget.copy(carState.forward).multiplyScalar(5).add(carState.position);
    lookTarget.y += 0.8;

    easing.damp3(state.camera.position, desired, 0.18, delta);
    easing.damp3(curLook.current, lookTarget, 0.18, delta);
    state.camera.lookAt(curLook.current);

    // Subtle FOV kick while boosting for a sense of speed.
    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      const targetFov = carState.boosting ? 60 : 50;
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 6, delta);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
