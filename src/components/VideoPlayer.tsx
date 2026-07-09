"use client";

import { extractVimeoId, getVimeoEmbedUrl, getVimeoPlayerUrl } from "@/utils/vimeo";

interface VideoPlayerProps {
  vimeoUrl: string;
  title?: string;
  background?: boolean;
  fill?: boolean;
  className?: string;
}

export function VideoPlayer({
  vimeoUrl,
  title = "Video",
  background = false,
  fill = false,
  className = "",
}: VideoPlayerProps) {
  const videoId = extractVimeoId(vimeoUrl);

  if (!videoId) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 ${
          fill ? "h-full w-full" : "aspect-video"
        } ${className}`}
      >
        <p className="text-sm text-white/40">Invalid Vimeo URL</p>
      </div>
    );
  }

  const embedUrl = background
    ? getVimeoEmbedUrl(videoId)
    : getVimeoPlayerUrl(videoId);

  return (
    <div
      className={`relative overflow-hidden bg-black ${
        fill ? "h-full w-full" : ""
      } ${className}`}
    >
      <div className={`relative w-full ${fill ? "h-full" : "aspect-video"}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
