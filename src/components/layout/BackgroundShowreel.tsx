"use client";

import { VideoPlayer } from "@/components/VideoPlayer";

interface BackgroundShowreelProps {
  vimeoUrl: string;
}

export function BackgroundShowreel({ vimeoUrl }: BackgroundShowreelProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <VideoPlayer
        vimeoUrl={vimeoUrl}
        title="Background Showreel"
        background
        fill
        className="h-full"
      />
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
