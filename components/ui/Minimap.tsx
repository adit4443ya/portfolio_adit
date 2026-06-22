"use client";

import { useEffect, useRef } from "react";
import { carState } from "@/lib/carState";
import { stations } from "@/lib/data";
import { ACCENT } from "@/lib/palette";
import { useStore } from "@/lib/store";

const SIZE = 150;
const C = SIZE / 2;
const R = 62;
const RANGE = 44; // world units mapped to the radar radius

export default function Minimap() {
  const phase = useStore((s) => s.phase);
  const nearbyId = useStore((s) => s.nearbyId);
  const rover = useRef<SVGGElement>(null);

  // Drive the rover marker straight from carState each frame (no re-renders).
  useEffect(() => {
    if (phase !== "explore") return;
    let raf = 0;
    const tick = () => {
      if (rover.current) {
        let ox = (carState.position.x / RANGE) * R;
        let oy = (carState.position.z / RANGE) * R;
        const len = Math.hypot(ox, oy);
        if (len > R) {
          ox = (ox / len) * R;
          oy = (oy / len) * R;
        }
        const deg = (Math.atan2(carState.forward.x, -carState.forward.z) * 180) / Math.PI;
        rover.current.setAttribute(
          "transform",
          `translate(${(C + ox).toFixed(1)} ${(C + oy).toFixed(1)}) rotate(${deg.toFixed(1)})`
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (phase !== "explore") return null;

  return (
    <div className="minimap">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%">
        <circle cx={C} cy={C} r={R} className="mm-ring" />
        <circle cx={C} cy={C} r={R * 0.6} className="mm-ring" />
        <line x1={C} y1={C - R} x2={C} y2={C + R} className="mm-cross" />
        <line x1={C - R} y1={C} x2={C + R} y2={C} className="mm-cross" />
        {stations.map((s) => {
          const x = C + (s.position[0] / RANGE) * R;
          const y = C + (s.position[2] / RANGE) * R;
          const on = nearbyId === s.id;
          return (
            <circle key={s.id} cx={x} cy={y} r={on ? 4.6 : 3} fill={ACCENT[s.accent]} opacity={on ? 1 : 0.78} />
          );
        })}
        <g ref={rover}>
          <polygon points="0,-5.5 4,5 -4,5" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}
