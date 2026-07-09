import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { getSiteSettings } from "@/services/settings";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-10 md:px-10 md:pb-32 md:pt-16">
        <FadeIn>
          <h1 className="mb-16 text-xs tracking-[0.3em] text-white/40 md:mb-24">
            CONTACT
          </h1>
        </FadeIn>

        <div className="space-y-12 md:space-y-16">
          <FadeIn delay={0.1}>
            <ContactItem label="EMAIL" href={`mailto:${settings.contactEmail}`}>
              {settings.contactEmail}
            </ContactItem>
          </FadeIn>
          <FadeIn delay={0.2}>
            <ContactItem
              label="PHONE"
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
            >
              {settings.phone}
            </ContactItem>
          </FadeIn>
          <FadeIn delay={0.3}>
            <ContactItem
              label="INSTAGRAM"
              href={settings.instagram}
              external
            >
              {settings.instagram.replace(/^https?:\/\/(www\.)?/, "@")}
            </ContactItem>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}

function ContactItem({
  label,
  href,
  children,
  external = false,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs tracking-[0.2em] text-white/40">{label}</p>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-lg text-white transition-opacity hover:opacity-65 md:text-2xl"
      >
        {children}
      </a>
    </div>
  );
}
