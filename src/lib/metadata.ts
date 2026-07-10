import type { Metadata } from "next";
import { BRAND_NAME, SITE_NAME } from "@/utils/constants";
import type { SiteSettings } from "@/types/settings";

const DEFAULT_DESCRIPTION = "Video production studio portfolio";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function buildSiteMetadata(settings?: Pick<SiteSettings, "logo">): Metadata {
  const siteUrl = getSiteUrl();
  const logo = settings?.logo?.trim();
  const ogImage = [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_NAME,
      template: `%s — ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    ...(logo
      ? {
          icons: {
            icon: logo,
            apple: logo,
          },
        }
      : {}),
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: siteUrl,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: ogImage.map((image) => image.url),
    },
  };
}

export function getBrandLabel(): string {
  return BRAND_NAME;
}
