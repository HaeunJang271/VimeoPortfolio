"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MarketingContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isHome]);

  return (
    <div
      className={
        isHome
          ? "relative h-dvh overflow-hidden bg-transparent"
          : "relative min-h-dvh bg-transparent"
      }
    >
      {children}
    </div>
  );
}
