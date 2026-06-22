"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { profile, stationById } from "@/lib/data";
import { ACCENT } from "@/lib/palette";
import { useIsTouch } from "@/hooks/useIsTouch";

export default function Hud() {
  const phase = useStore((s) => s.phase);
  const nearbyId = useStore((s) => s.nearbyId);
  const activeId = useStore((s) => s.activeId);
  const isTouch = useIsTouch();

  // Global keyboard: E / Enter to inspect the nearby station, Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useStore.getState();
      if (st.phase !== "explore") return;
      if (e.code === "KeyE" || e.code === "Enter") {
        if (st.nearbyId && !st.activeId) st.open(st.nearbyId);
      } else if (e.code === "Escape") {
        if (st.activeId) st.close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (phase !== "explore") return null;
  const near = stationById(nearbyId);

  return (
    <>
      <div className="hud-brand">
        <span className="hud-name">{profile.name}</span>
        <span className="hud-role">{profile.role}</span>
      </div>

      <div className="hud-legend">
        <span>
          <b>WASD</b> drive
        </span>
        <span>
          <b>Shift</b> boost
        </span>
        <span>
          <b>E</b> inspect
        </span>
      </div>

      {near && !activeId && (
        <button
          className="prompt"
          style={{ ["--c" as string]: ACCENT[near.accent] }}
          onClick={() => useStore.getState().open(near.id)}
        >
          <span className="prompt-code">
            {near.code} · {near.label}
          </span>
          <span className="prompt-act">{isTouch ? "Tap to inspect" : "Press E to inspect"}</span>
        </button>
      )}
    </>
  );
}
