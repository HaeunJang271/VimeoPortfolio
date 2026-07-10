"use client";

import { useEffect, useState } from "react";
import {
  extractVimeoId,
  getVimeoEmbedUrl,
  getVimeoPlayerUrl,
} from "@/utils/vimeo";

interface VideoPlayerProps {
  vimeoUrl: string;
  vimeoVideoId?: string | null;
  title?: string;
  background?: boolean;
  fill?: boolean;
  className?: string;
}

export function VideoPlayer({
  vimeoUrl,
  vimeoVideoId,
  title = "Video",
  background = false,
  fill = false,
  className = "",
}: VideoPlayerProps) {
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(
    vimeoVideoId ?? extractVimeoId(vimeoUrl)
  );
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const directId = vimeoVideoId ?? extractVimeoId(vimeoUrl);
    if (directId) {
      setResolvedVideoId(directId);
      return;
    }

    let cancelled = false;
    setResolving(true);

    void fetch(`/api/vimeo/resolve?url=${encodeURIComponent(vimeoUrl)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { videoId?: string };
        return data.videoId ?? null;
      })
      .then((videoId) => {
        if (!cancelled) {
          setResolvedVideoId(videoId);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setResolving(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [vimeoUrl, vimeoVideoId]);

  if (resolving) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 ${
          fill ? "h-full w-full" : "aspect-video"
        } ${className}`}
      >
        <p className="text-sm text-white/40">Loading video...</p>
      </div>
    );
  }

  if (!resolvedVideoId) {
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
    ? getVimeoEmbedUrl(resolvedVideoId)
    : getVimeoPlayerUrl(resolvedVideoId);

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
