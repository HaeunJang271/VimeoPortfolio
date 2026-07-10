import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BackgroundShowreel } from "@/components/layout/BackgroundShowreel";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { MarketingContent } from "@/components/layout/MarketingContent";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildSiteMetadata(settings);
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header />
      <BackgroundShowreel vimeoUrl={settings.homepageShowreel} />
      <MarketingContent>{children}</MarketingContent>
      <MarketingChrome
        instagram={settings.instagram}
        vimeoUrl={settings.vimeoUrl}
        logo={settings.logo}
        logoHeight={settings.logoHeight}
        copyrightText={settings.copyrightText}
      />
    </>
  );
}
