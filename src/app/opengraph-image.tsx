import { ImageResponse } from "next/og";
import { BRAND_NAME } from "@/utils/constants";

export const runtime = "edge";
export const alt = BRAND_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#000000",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          {BRAND_NAME}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          VIDEO PRODUCTION STUDIO
        </div>
      </div>
    ),
    size
  );
}
