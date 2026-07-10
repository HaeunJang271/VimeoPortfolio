import { ImageResponse } from "next/og";
import { BRAND_NAME } from "@/utils/constants";
import {
  getDefaultOgImageMarkup,
  getLogoOgImageMarkup,
  getOgLogoDataUrl,
  OG_IMAGE_SIZE,
} from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = BRAND_NAME;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoDataUrl = await getOgLogoDataUrl();

  return new ImageResponse(
    logoDataUrl ? getLogoOgImageMarkup(logoDataUrl) : getDefaultOgImageMarkup(),
    OG_IMAGE_SIZE
  );
}
