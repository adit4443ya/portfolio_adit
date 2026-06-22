"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useStore } from "@/lib/store";
import { profile } from "@/lib/data";
import { useIsTouch } from "@/hooks/useIsTouch";

export default function Intro() {
  const phase = useStore((s) => s.phase);
  const isTouch = useIsTouch();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "ready" && root.current) {
      gsap.fromTo(
        root.current.querySelectorAll("[data-anim]"),
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.12 }
      );
    }
  }, [phase]);

  if (phase !== "ready") return null;

  const start = () => {
    if (!root.current) return;
    gsap.to(root.current, {
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => useStore.getState().enter(),
    });
  };

  return (
    <div ref={root} className="intro">
      <div className="intro-card">
        <p className="eyebrow" data-anim>
          {profile.stamp}
        </p>
        <h1 className="intro-name" data-anim>
          {profile.name}
        </h1>
        <p className="intro-tag" data-anim>
          {profile.tagline}
        </p>

        <div className="intro-keys" data-anim>
          <span>
            <b>W A S D</b> / arrows — drive
          </span>
          <span>
            <b>Shift</b> — boost
          </span>
          <span>
            <b>E</b> — inspect a sector
          </span>
        </div>

        <button className="intro-btn" data-anim onClick={start}>
          {isTouch ? "Tap to enter the world" : "Drive to explore →"}
        </button>
      </div>
    </div>
  );
}
