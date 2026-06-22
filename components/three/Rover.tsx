"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { carState, SPAWN } from "@/lib/carState";
import { useStore } from "@/lib/store";

// ── Arcade tuning (all freely tweakable for "feel") ───────────────────────
const ENGINE = 30; // forward impulse strength
const MAX_SPEED = 17; // m/s cap
const TURN = 2.7; // steering rad/s
const BOOST = 1.7; // shift multiplier
const ACCENT = "#e8a26b";

// Reusable temporaries (single rover instance → safe at module scope).
const q = new THREE.Quaternion();
const forward = new THREE.Vector3();
const planar = new THREE.Vector3();
const impulse = new THREE.Vector3();

export default function Rover() {
  const body = useRef<RapierRigidBody>(null);
  const wheels = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();

  useFrame((_, delta) => {
    const rb = body.current;
    if (!rb) return;
    const dt = Math.min(delta, 1 / 30); // clamp to keep physics stable on lag

    const k = getKeys() as Record<string, boolean>;
    const { touch, activeId } = useStore.getState();

    let throttle = 0;
    let steer = 0;
    let braking = false;

    // Freeze controls while a station panel is open.
    if (!activeId) {
      throttle = (k.forward ? 1 : 0) - (k.back ? 1 : 0) + touch.forward;
      steer = (k.left ? 1 : 0) - (k.right ? 1 : 0) + touch.turn;
      braking = k.brake || touch.brake;
    }
    throttle = THREE.MathUtils.clamp(throttle, -1, 1);
    steer = THREE.MathUtils.clamp(steer, -1, 1);
    const boost = k.boost ? BOOST : 1;

    const rot = rb.rotation();
    q.set(rot.x, rot.y, rot.z, rot.w);
    forward.set(0, 0, -1).applyQuaternion(q).normalize();

    const lin = rb.linvel();
    planar.set(lin.x, 0, lin.z);
    const speed = planar.length();
    const heading = Math.sign(planar.dot(forward)) || 1;

    // Drive
    if (throttle !== 0 && speed < MAX_SPEED * boost) {
      impulse.copy(forward).multiplyScalar(throttle * ENGINE * boost * dt);
      rb.applyImpulse({ x: impulse.x, y: 0, z: impulse.z }, true);
    }

    // Steer — scale by speed so it can't pivot in place, invert in reverse.
    let steerScale = THREE.MathUtils.clamp(speed / 2.5, 0, 1);
    if (throttle !== 0) steerScale = Math.max(steerScale, 0.4);
    rb.setAngvel({ x: 0, y: -steer * TURN * steerScale * heading, z: 0 }, true);

    // Brake / hold still while reading.
    if (braking || activeId) {
      rb.setLinvel({ x: lin.x * 0.82, y: lin.y, z: lin.z * 0.82 }, true);
    }

    // Speed cap.
    if (speed > MAX_SPEED * boost) {
      const f = (MAX_SPEED * boost) / speed;
      rb.setLinvel({ x: lin.x * f, y: lin.y, z: lin.z * f }, true);
    }

    // Respawn if knocked off the world.
    const p = rb.translation();
    if (p.y < -8) {
      rb.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Publish for the camera + proximity manager.
    carState.position.set(p.x, p.y, p.z);
    carState.forward.copy(forward);
    carState.speed = speed * heading;

    // Spin wheels for a touch of life.
    if (wheels.current) {
      const spin = carState.speed * dt * 1.6;
      for (const w of wheels.current.children) w.rotation.x -= spin;
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, true, false]}
      linearDamping={0.8}
      angularDamping={4}
      canSleep={false}
      ccd
    >
      <CuboidCollider args={[1, 0.45, 2]} mass={1.6} />

      {/* chassis */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[1.9, 0.55, 3.7]} />
        <meshStandardMaterial color="#14181f" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* cabin */}
      <mesh castShadow position={[0, 0.62, -0.15]}>
        <boxGeometry args={[1.35, 0.5, 1.7]} />
        <meshStandardMaterial color="#0c0f14" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* glowing accent strip */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.94, 0.06, 3.74]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      {/* headlight bar */}
      <mesh position={[0, 0.2, -1.9]}>
        <boxGeometry args={[1.4, 0.18, 0.1]} />
        <meshStandardMaterial
          color="#fff4e6"
          emissive="#fff0d8"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* wheels */}
      <group ref={wheels}>
        {(
          [
            [-1.0, -0.15, 1.25],
            [1.0, -0.15, 1.25],
            [-1.0, -0.15, -1.25],
            [1.0, -0.15, -1.25],
          ] as const
        ).map((pos, i) => (
          <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 18]} />
            <meshStandardMaterial color="#05070a" metalness={0.4} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* moving underglow */}
      <pointLight position={[0, 0.2, 0]} color={ACCENT} intensity={6} distance={9} decay={2} />
    </RigidBody>
  );
}
