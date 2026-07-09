"use client";

import { VideoPlayer } from "@/components/VideoPlayer";
import { SHOWREEL_VIMEO_ID } from "@/utils/constants";

export function ShowreelHero() {
  return (
    <section className="relative h-screen w-full">
      <VideoPlayer
        vimeoUrl={SHOWREEL_VIMEO_ID}
        title="Showreel"
        background
        fill
        className="h-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
    </section>
  );
}
