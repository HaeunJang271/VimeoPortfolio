import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CreditList } from "@/components/CreditList";
import { FadeIn } from "@/components/FadeIn";
import { RelatedWorks } from "@/components/RelatedWorks";
import { VideoPlayer } from "@/components/VideoPlayer";
import {
  getAdjacentWorks,
  getRelatedWorksByDirector,
  getWorkBySlug,
  getWorks,
} from "@/services/works";

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
  const relatedWorks = getRelatedWorksByDirector(works, work);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 md:px-10 md:pb-32 md:pt-12">
        <FadeIn>
          <h1 className="mb-8 text-2xl font-medium tracking-[0.03em] text-white md:mb-10 md:text-4xl">
            {work.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.05}>
          <VideoPlayer vimeoUrl={work.vimeoUrl} title={work.title} />
        </FadeIn>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,1fr)_260px] md:gap-20">
          <FadeIn delay={0.1}>
            <div>
              {work.description && (
                <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/60 md:text-base">
                  {work.description}
                </p>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <CreditList credits={work.credits} />
          </FadeIn>
        </div>

        <RelatedWorks works={relatedWorks} />

        <FadeIn delay={0.2}>
          <nav className="mt-14 flex items-center justify-between border-t border-white/10 pt-8 md:mt-20 md:pt-10">
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className="group flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span className="tracking-[0.05em]">Previous Project</span>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/work/${next.slug}`}
                className="group flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white"
              >
                <span className="tracking-[0.05em]">Next Project</span>
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
  );
}
