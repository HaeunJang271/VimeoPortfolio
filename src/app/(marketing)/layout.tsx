import { Header } from "@/components/Header";
import { BackgroundShowreel } from "@/components/layout/BackgroundShowreel";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { MarketingContent } from "@/components/layout/MarketingContent";
import { getSiteSettings } from "@/services/settings";

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
        homepageShowreel={settings.homepageShowreel}
      />
    </>
  );
}
