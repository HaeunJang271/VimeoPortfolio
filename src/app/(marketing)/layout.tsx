import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BackgroundShowreel } from "@/components/layout/BackgroundShowreel";
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
      <div className="relative min-h-screen bg-transparent pt-24 md:pt-28">
        {children}
      </div>
      <Footer />
    </>
  );
}
