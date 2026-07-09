import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { getSiteSettings } from "@/services/settings";

export default async function DirectorDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      {children}
      <MarketingChrome
        instagram={settings.instagram}
        vimeoUrl={settings.vimeoUrl}
      />
    </>
  );
}
