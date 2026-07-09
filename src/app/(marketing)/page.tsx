import { FadeIn } from "@/components/FadeIn";
import { LogoBadge } from "@/components/layout/LogoBadge";
import { getSiteSettings } from "@/services/settings";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <main className="relative flex min-h-[calc(100vh-6rem)] items-end">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between px-6 pb-8 md:px-10 md:pb-10">
        <FadeIn direction="up">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.25em] text-white/45">SHOWREEL</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} direction="up">
          <LogoBadge logo={settings.logo} />
        </FadeIn>
      </div>
    </main>
  );
}
