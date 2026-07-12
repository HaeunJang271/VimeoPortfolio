import { Header } from "@/components/Header";
import { BackgroundShowreel } from "@/components/layout/BackgroundShowreel";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { MarketingContent } from "@/components/layout/MarketingContent";
import { getShowreelMedia } from "@/lib/vimeo/showreel";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const showreel = await getShowreelMedia(settings.homepageShowreel);

  return (
    <>
      <Header />
      <BackgroundShowreel videoId={showreel.videoId} />
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
