"use client";

import { useEffect, useRef } from "react";
import { getVimeoEmbedUrl } from "@/utils/vimeo";

interface BackgroundShowreelProps {
  videoId: string | null;
}

const VIMEO_ORIGIN = "https://player.vimeo.com";

export function BackgroundShowreel({ videoId }: BackgroundShowreelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!videoId) return;

    function post(method: string, value?: string) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify(value === undefined ? { method } : { method, value }),
        VIMEO_ORIGIN
      );
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== VIMEO_ORIGIN) return;

      let data: { event?: string };
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      // 플레이어가 준비되면 자동재생을 시도한다.
      if (data.event === "ready") {
        post("play");
      }
    }

    // 사용자의 첫 상호작용(터치·스크롤·클릭 등)은 저전력 모드에서도
    // 재생이 허용되므로, 그 순간 재생을 트리거한다.
    function kickstart() {
      post("play");
    }

    const interactionEvents = [
      "pointerdown",
      "touchstart",
      "keydown",
      "wheel",
      "scroll",
    ];

    window.addEventListener("message", handleMessage);
    interactionEvents.forEach((eventName) =>
      window.addEventListener(eventName, kickstart, { passive: true })
    );

    return () => {
      window.removeEventListener("message", handleMessage);
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, kickstart)
      );
    };
  }, [videoId]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {videoId ? (
        <iframe
          ref={iframeRef}
          src={getVimeoEmbedUrl(videoId)}
          title="Background Showreel"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onLoad={() => {
            iframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ method: "play" }),
              VIMEO_ORIGIN
            );
          }}
          className="absolute inset-0 h-full w-full"
        />
      ) : null}
    </div>
  );
}
