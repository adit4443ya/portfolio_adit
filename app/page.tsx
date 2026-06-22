"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Intro from "@/components/ui/Intro";
import Hud from "@/components/ui/Hud";
import StationPanel from "@/components/ui/StationPanel";
import MobileControls from "@/components/ui/MobileControls";

// WebGL must only run on the client.
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="stage">
      <Experience />
      <LoadingScreen />
      <Intro />
      <Hud />
      <StationPanel />
      <MobileControls />
    </main>
  );
}
