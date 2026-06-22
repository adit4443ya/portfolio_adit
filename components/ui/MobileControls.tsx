"use client";

import { useStore, type TouchInput } from "@/lib/store";
import { useIsTouch } from "@/hooks/useIsTouch";

export default function MobileControls() {
  const phase = useStore((s) => s.phase);
  const isTouch = useIsTouch();
  const setTouch = useStore((s) => s.setTouch);

  if (!isTouch || phase !== "explore") return null;

  const hold =
    (patch: Partial<TouchInput>, release: Partial<TouchInput>) => ({
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        setTouch(patch);
      },
      onPointerUp: () => setTouch(release),
      onPointerLeave: () => setTouch(release),
      onPointerCancel: () => setTouch(release),
    });

  return (
    <div className="mc">
      <div className="mc-cluster mc-left">
        <button className="mc-btn" {...hold({ turn: 1 }, { turn: 0 })} aria-label="steer left">
          ◀
        </button>
        <button className="mc-btn" {...hold({ turn: -1 }, { turn: 0 })} aria-label="steer right">
          ▶
        </button>
      </div>
      <div className="mc-cluster mc-right">
        <button className="mc-btn mc-go" {...hold({ forward: 1 }, { forward: 0 })} aria-label="accelerate">
          ▲
        </button>
        <button className="mc-btn" {...hold({ forward: -1 }, { forward: 0 })} aria-label="reverse">
          ▼
        </button>
      </div>
    </div>
  );
}
