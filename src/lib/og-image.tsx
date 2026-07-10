import { BRAND_NAME } from "@/utils/constants";
import { getSiteSettings } from "@/services/settings";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export async function getOgLogoDataUrl(): Promise<string | null> {
  const settings = await getSiteSettings();
  const logo = settings.logo?.trim();
  if (!logo) return null;

  try {
    const response = await fetch(logo, { next: { revalidate: 300 } });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export function getDefaultOgImageMarkup() {
  return (
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
  );
}

export function getLogoOgImageMarkup(logoDataUrl: string) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        padding: "80px",
      }}
    >
      <img
        src={logoDataUrl}
        alt=""
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
