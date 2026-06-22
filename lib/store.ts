import { create } from "zustand";

export type Phase = "loading" | "ready" | "explore";

export interface TouchInput {
  forward: number; // -1 .. 1
  turn: number; // -1 .. 1
  brake: boolean;
}

interface State {
  phase: Phase;
  nearbyId: string | null;
  activeId: string | null;
  touch: TouchInput;
  muted: boolean;
  setPhase: (p: Phase) => void;
  toggleMute: () => void;
  enter: () => void;
  setNearby: (id: string | null) => void;
  open: (id: string) => void;
  close: () => void;
  setTouch: (t: Partial<TouchInput>) => void;
}

export const useStore = create<State>()((set) => ({
  phase: "loading",
  nearbyId: null,
  activeId: null,
  touch: { forward: 0, turn: 0, brake: false },
  muted: false,
  setPhase: (phase) => set({ phase }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  enter: () => set({ phase: "explore" }),
  // Only trigger a re-render when the nearby station actually changes.
  setNearby: (nearbyId) =>
    set((s) => (s.nearbyId === nearbyId ? s : { nearbyId })),
  open: (activeId) => set({ activeId }),
  close: () => set({ activeId: null }),
  setTouch: (t) => set((s) => ({ touch: { ...s.touch, ...t } })),
}));
