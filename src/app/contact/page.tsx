import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { CONTACT } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl px-6 pb-24 md:px-10 md:pb-32">
          <FadeIn>
            <h1 className="mb-20 text-sm font-medium tracking-[0.3em] text-white/40 md:mb-28">
              CONTACT
            </h1>
          </FadeIn>

          <div className="space-y-12 md:space-y-16">
            <FadeIn delay={0.1}>
              <ContactItem label="EMAIL">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-lg text-white transition-opacity hover:opacity-60 md:text-xl"
                >
                  {CONTACT.email}
                </a>
              </ContactItem>
            </FadeIn>

            <FadeIn delay={0.2}>
              <ContactItem label="PHONE">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="text-lg text-white transition-opacity hover:opacity-60 md:text-xl"
                >
                  {CONTACT.phone}
                </a>
              </ContactItem>
            </FadeIn>

            <FadeIn delay={0.3}>
              <ContactItem label="INSTAGRAM">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-white transition-opacity hover:opacity-60 md:text-xl"
                >
                  {CONTACT.instagram.replace(/^https?:\/\/(www\.)?/, "@")}
                </a>
              </ContactItem>
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ContactItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs tracking-[0.2em] text-white/40">{label}</p>
      {children}
    </div>
  );
}
