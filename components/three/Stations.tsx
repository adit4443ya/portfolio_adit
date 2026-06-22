"use client";

import { stations } from "@/lib/data";
import Station from "./Station";

export default function Stations() {
  return (
    <>
      {stations.map((s) => (
        <Station key={s.id} station={s} />
      ))}
    </>
  );
}
