import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CreditList } from "@/components/CreditList";
import { getAdjacentWorks, getWorkBySlug, getWorks } from "@/services/works";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  return { title: work?.title ?? "Project" };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) notFound();

  const works = await getWorks();
  const { prev, next } = getAdjacentWorks(works, slug);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-28 md:pt-36">
        <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
          <FadeIn>
            <VideoPlayer vimeoUrl={work.vimeo_url} title={work.title} />
          </FadeIn>

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[1fr_280px] md:gap-20">
            <FadeIn delay={0.1}>
              <div className="space-y-8">
                <h1 className="text-2xl font-medium tracking-[0.02em] md:text-3xl">
                  {work.title}
                </h1>
                {work.description && (
                  <p className="max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
                    {work.description}
                  </p>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <CreditList credits={work.credits} />
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <nav className="mt-20 flex items-center justify-between border-t border-white/10 pt-10">
              {prev ? (
                <Link
                  href={`/work/${prev.slug}`}
                  className="group flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white"
                >
                  <ArrowLeft
                    size={16}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  <span className="tracking-[0.05em]">{prev.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="group flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white"
                >
                  <span className="tracking-[0.05em]">{next.title}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
