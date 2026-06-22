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
    // Position: 9 units behind the heading, 5.5 up.
    desired
      .copy(carState.forward)
      .multiplyScalar(-9)
      .add(carState.position);
    desired.y = carState.position.y + 5.5;

    // Aim a little ahead of the rover.
    lookTarget
      .copy(carState.forward)
      .multiplyScalar(3)
      .add(carState.position);
    lookTarget.y += 0.6;

    easing.damp3(state.camera.position, desired, 0.28, delta);
    easing.damp3(curLook.current, lookTarget, 0.22, delta);
    state.camera.lookAt(curLook.current);
  });

  return null;
}
