"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Trail, RoundedBox } from "@react-three/drei";
import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { carState, SPAWN } from "@/lib/carState";
import { useStore } from "@/lib/store";

// ── Arcade tuning (moderate, freely tweakable) ────────────────────────────
const ENGINE = 48; // forward impulse strength
const MAX_SPEED = 22; // m/s cap
const TURN = 2.9; // steering rad/s
const BOOST = 1.6; // shift multiplier
const BODY = "#0c0e16";
const NEON = "#ff2e88"; // magenta underglow / rails
const TRAIL = "#00e5ff"; // cyan light trail

const q = new THREE.Quaternion();
const forward = new THREE.Vector3();
const planar = new THREE.Vector3();
const impulse = new THREE.Vector3();

export default function Rover() {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const tail = useRef<THREE.MeshStandardMaterial>(null);
  const [, getKeys] = useKeyboardControls();

  useFrame((_, delta) => {
    const rb = body.current;
    if (!rb) return;
    if (carState.body !== rb) carState.body = rb;
    const dt = Math.min(delta, 1 / 30);

    const k = getKeys() as Record<string, boolean>;
    const { touch, activeId } = useStore.getState();

    let throttle = 0;
    let steer = 0;
    let braking = false;
    if (!activeId) {
      throttle = (k.forward ? 1 : 0) - (k.back ? 1 : 0) + touch.forward;
      steer = (k.left ? 1 : 0) - (k.right ? 1 : 0) + touch.turn;
      braking = k.brake || touch.brake;
    }
    throttle = THREE.MathUtils.clamp(throttle, -1, 1);
    steer = THREE.MathUtils.clamp(steer, -1, 1);
    const boosting = !activeId && !!k.boost;
    const driveBoost = boosting ? BOOST : 1;
    // Boost pads raise the speed cap so their impulse isn't clamped away.
    const capBoost = driveBoost * (carState.padBoost ? 1.7 : 1);
    carState.boosting = (boosting || carState.padBoost) && Math.abs(carState.speed) > 1;

    const rot = rb.rotation();
    q.set(rot.x, rot.y, rot.z, rot.w);
    forward.set(0, 0, -1).applyQuaternion(q).normalize();

    const lin = rb.linvel();
    planar.set(lin.x, 0, lin.z);
    const speed = planar.length();
    const heading = Math.sign(planar.dot(forward)) || 1;

    // Drive
    if (throttle !== 0 && speed < MAX_SPEED * capBoost) {
      impulse.copy(forward).multiplyScalar(throttle * ENGINE * driveBoost * dt);
      rb.applyImpulse({ x: impulse.x, y: 0, z: impulse.z }, true);
    }

    // Steer — inverts in reverse (heading) so it feels like a real car.
    let steerScale = THREE.MathUtils.clamp(speed / 2.5, 0, 1);
    if (throttle !== 0) steerScale = Math.max(steerScale, 0.5);
    rb.setAngvel({ x: 0, y: steer * TURN * steerScale * heading, z: 0 }, true);

    if (braking || activeId) {
      rb.setLinvel({ x: lin.x * 0.82, y: lin.y, z: lin.z * 0.82 }, true);
    }
    if (speed > MAX_SPEED * capBoost) {
      const f = (MAX_SPEED * capBoost) / speed;
      rb.setLinvel({ x: lin.x * f, y: lin.y, z: lin.z * f }, true);
    }

    const p = rb.translation();
    if (p.y < -8) {
      rb.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    carState.position.set(p.x, p.y, p.z);
    carState.forward.copy(forward);
    carState.speed = speed * heading;

    // Body lean into turns + squat under throttle.
    if (visual.current) {
      const av = rb.angvel().y;
      const leanZ = THREE.MathUtils.clamp(-av * 0.05, -0.2, 0.2);
      const pitchX = THREE.MathUtils.clamp(-throttle * 0.04, -0.05, 0.05);
      visual.current.rotation.z = THREE.MathUtils.damp(visual.current.rotation.z, leanZ, 8, dt);
      visual.current.rotation.x = THREE.MathUtils.damp(visual.current.rotation.x, pitchX, 8, dt);
    }
    // Taillights flare on brake/reverse.
    if (tail.current) {
      const lit = braking || throttle < 0 ? 6 : 1.4;
      tail.current.emissiveIntensity = THREE.MathUtils.damp(tail.current.emissiveIntensity, lit, 10, dt);
    }
    // Spin wheels.
    if (wheels.current) {
      const spin = carState.speed * dt * 1.7;
      for (const w of wheels.current.children) w.rotation.x -= spin;
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, true, false]}
      linearDamping={0.7}
      angularDamping={5}
      canSleep={false}
      ccd
    >
      <CuboidCollider args={[0.95, 0.4, 2.0]} mass={1.2} />

      <group ref={visual}>
        {/* underglow */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.3, 4.6]} />
          <meshBasicMaterial
            color={NEON}
            transparent
            opacity={0.45}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* low wide body */}
        <RoundedBox args={[1.9, 0.42, 4.0]} radius={0.16} smoothness={4} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color={BODY} metalness={0.7} roughness={0.25} />
        </RoundedBox>
        {/* hood wedge */}
        <RoundedBox args={[1.7, 0.26, 1.4]} radius={0.12} smoothness={4} position={[0, 0.34, -1.3]} castShadow>
          <meshStandardMaterial color={BODY} metalness={0.7} roughness={0.25} />
        </RoundedBox>
        {/* cabin / canopy */}
        <RoundedBox args={[1.4, 0.5, 1.7]} radius={0.18} smoothness={4} position={[0, 0.78, 0.1]} castShadow>
          <meshStandardMaterial color="#0a1018" metalness={0.4} roughness={0.08} />
        </RoundedBox>

        {/* neon side rails */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.96, 0.42, 0]}>
            <boxGeometry args={[0.05, 0.08, 3.4]} />
            <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={3} toneMapped={false} />
          </mesh>
        ))}

        {/* spoiler */}
        <mesh position={[0, 0.78, 2.0]} castShadow>
          <boxGeometry args={[1.7, 0.06, 0.4]} />
          <meshStandardMaterial color="#05070c" metalness={0.6} roughness={0.4} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.7, 0.62, 2.0]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshStandardMaterial color="#05070c" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}

        {/* headlights (cyan) */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.62, 0.4, -2.0]}>
            <boxGeometry args={[0.42, 0.1, 0.08]} />
            <meshStandardMaterial color={TRAIL} emissive={TRAIL} emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        ))}
        {/* taillight bar (brake/reverse) */}
        <mesh position={[0, 0.5, 2.18]}>
          <boxGeometry args={[1.5, 0.12, 0.06]} />
          <meshStandardMaterial ref={tail} color="#ff3344" emissive="#ff2244" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>

        {/* wheels with neon rims */}
        <group ref={wheels}>
          {(
            [
              [-1.0, 0.0, 1.3],
              [1.0, 0.0, 1.3],
              [-1.0, 0.0, -1.3],
              [1.0, 0.0, -1.3],
            ] as const
          ).map((pos, i) => (
            <group key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.46, 0.46, 0.36, 22]} />
                <meshStandardMaterial color="#0a0c12" metalness={0.4} roughness={0.6} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.28, 0.04, 10, 24]} />
                <meshStandardMaterial color={TRAIL} emissive={TRAIL} emissiveIntensity={1.6} toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>

        {/* twin light trails */}
        {[-1, 1].map((s) => (
          <Trail key={s} width={2.4} length={6} color={TRAIL} attenuation={(w) => w * w} local>
            <mesh position={[s * 0.62, 0.5, 2.2]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={TRAIL} toneMapped={false} />
            </mesh>
          </Trail>
        ))}
      </group>

      {/* moving lights */}
      <pointLight position={[0, 0.2, 0]} color={NEON} intensity={8} distance={11} decay={2} />
      <pointLight position={[0, 0.3, -2]} color={TRAIL} intensity={5} distance={9} decay={2} />
    </RigidBody>
  );
}
