"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Trail } from "@react-three/drei";
import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { carState, SPAWN } from "@/lib/carState";
import { useStore } from "@/lib/store";

// ── Arcade tuning (all freely tweakable for "feel") ───────────────────────
const ENGINE = 78; // forward impulse strength
const MAX_SPEED = 34; // m/s cap
const TURN = 3.2; // steering rad/s
const BOOST = 1.7; // shift multiplier
const ACCENT = "#e8a26b";

// Reusable temporaries (single rover instance → safe at module scope).
const q = new THREE.Quaternion();
const forward = new THREE.Vector3();
const planar = new THREE.Vector3();
const impulse = new THREE.Vector3();

export default function Rover() {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const brakeMat = useRef<THREE.MeshStandardMaterial>(null);
  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
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
    const boosting = !activeId && !!k.boost;
    const boost = boosting ? BOOST : 1;
    carState.boosting = boosting && Math.abs(throttle) > 0;

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

    // Steer — positive yaw turns the (-Z facing) car left, so press-left = left.
    // Direction-consistent (no reverse inversion) to keep controls predictable.
    let steerScale = THREE.MathUtils.clamp(speed / 2.5, 0, 1);
    if (throttle !== 0) steerScale = Math.max(steerScale, 0.5);
    rb.setAngvel({ x: 0, y: steer * TURN * steerScale, z: 0 }, true);

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

    // Visual hover bob + body lean into turns + slight pitch under throttle.
    if (visual.current) {
      const av = rb.angvel().y;
      const leanZ = THREE.MathUtils.clamp(-av * 0.05, -0.22, 0.22);
      const pitchX = THREE.MathUtils.clamp(-throttle * 0.04, -0.05, 0.05);
      visual.current.rotation.z = THREE.MathUtils.damp(visual.current.rotation.z, leanZ, 8, dt);
      visual.current.rotation.x = THREE.MathUtils.damp(visual.current.rotation.x, pitchX, 8, dt);
      visual.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // Thruster glow brightens when braking or reversing.
    if (brakeMat.current) {
      const lit = braking || throttle < 0 ? 6 : 1.4;
      brakeMat.current.emissiveIntensity = THREE.MathUtils.damp(brakeMat.current.emissiveIntensity, lit, 10, dt);
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, true, false]}
      linearDamping={0.55}
      angularDamping={5}
      canSleep={false}
      ccd
    >
      <CuboidCollider args={[0.95, 0.45, 1.9]} mass={1.1} />

      <group ref={visual}>
        {/* underglow */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 4]} />
          <meshBasicMaterial
            color={ACCENT}
            transparent
            opacity={0.45}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* lower hull */}
        <mesh castShadow position={[0, 0.34, 0]}>
          <boxGeometry args={[1.7, 0.34, 3.5]} />
          <meshStandardMaterial color="#0e1219" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* bevelled deck */}
        <mesh castShadow position={[0, 0.57, 0.15]}>
          <boxGeometry args={[1.42, 0.22, 2.7]} />
          <meshStandardMaterial color="#0b0e15" metalness={0.85} roughness={0.26} />
        </mesh>
        {/* nose splitter */}
        <mesh castShadow position={[0, 0.24, -1.95]}>
          <boxGeometry args={[1.55, 0.14, 0.55]} />
          <meshStandardMaterial color="#0b0e15" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* tinted canopy */}
        <mesh castShadow position={[0, 0.78, -0.4]} scale={[1, 0.62, 1.25]}>
          <sphereGeometry args={[0.62, 24, 18]} />
          <meshStandardMaterial
            color="#0a1320"
            metalness={0.5}
            roughness={0.06}
            transparent
            opacity={0.86}
            emissive={ACCENT}
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* neon side rails */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.87, 0.42, 0]}>
            <boxGeometry args={[0.06, 0.1, 3.2]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2.8} toneMapped={false} />
          </mesh>
        ))}

        {/* headlights */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.55, 0.36, -1.82]}>
            <boxGeometry args={[0.42, 0.1, 0.12]} />
            <meshStandardMaterial color="#eaf6ff" emissive="#dff0ff" emissiveIntensity={3.5} toneMapped={false} />
          </mesh>
        ))}

        {/* rear engine pods */}
        {[-1, 1].map((s) => (
          <mesh key={s} castShadow position={[s * 0.55, 0.45, 1.85]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.27, 0.31, 0.55, 16]} />
            <meshStandardMaterial color="#0c1018" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {/* thruster light bar (also the brake/reverse indicator) */}
        <mesh position={[0, 0.45, 2.12]}>
          <boxGeometry args={[1.4, 0.16, 0.08]} />
          <meshStandardMaterial ref={brakeMat} color={ACCENT} emissive={ACCENT} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>

        {/* twin glowing motion trails from the thrusters */}
        {[-1, 1].map((s) => (
          <Trail key={s} width={2.6} length={6} color={ACCENT} attenuation={(w) => w * w} local>
            <mesh position={[s * 0.55, 0.45, 2.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={ACCENT} toneMapped={false} />
            </mesh>
          </Trail>
        ))}
      </group>

      {/* moving lights */}
      <pointLight position={[0, 0.2, 0]} color={ACCENT} intensity={7} distance={10} decay={2} />
      <pointLight position={[0, 0.4, 2.2]} color={ACCENT} intensity={5} distance={7} decay={2} />
    </RigidBody>
  );
}
