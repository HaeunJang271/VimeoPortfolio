import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreditList } from "@/components/CreditList";
import { FadeIn } from "@/components/FadeIn";
import { RelatedWorks } from "@/components/RelatedWorks";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getDirectors } from "@/services/directors";
import {
  getRelatedWorksByDirector,
  getWorkBySlug,
  getWorks,
} from "@/services/works";

export const dynamic = "force-dynamic";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
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

  const [works, directors] = await Promise.all([getWorks(), getDirectors()]);
  const directorWorkOrders = Object.fromEntries(
    directors.map((director) => [director.id, director.workOrder])
  );
  const relatedWorks = getRelatedWorksByDirector(
    works,
    work,
    directorWorkOrders,
    8
  );

  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 pb-40 pt-8 md:px-10 md:pb-44 md:pt-12">
        <FadeIn>
          <h1 className="max-w-4xl text-2xl font-medium leading-snug tracking-[0.02em] text-white md:text-4xl">
            {work.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-8 md:mt-10">
            <VideoPlayer vimeoUrl={work.vimeoUrl} title={work.title} />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <CreditList credits={work.credits} />
        </FadeIn>

        <FadeIn delay={0.15}>
          <RelatedWorks works={relatedWorks} />
        </FadeIn>
      </div>
    </main>
  );
}
