import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreditList } from "@/components/CreditList";
import { FadeIn } from "@/components/FadeIn";
import { RelatedWorks } from "@/components/RelatedWorks";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getDirectorBySlug, getDirectors } from "@/services/directors";
import { getPublicWorks, getRelatedWorksByDirector, getWorkBySlug } from "@/services/works";
import { decodeRouteParam } from "@/utils/paths";

export const dynamic = "force-dynamic";

interface DirectorWorkDetailPageProps {
  params: Promise<{ slug: string; workSlug: string }>;
}

export async function generateMetadata({
  params,
}: DirectorWorkDetailPageProps): Promise<Metadata> {
  const { workSlug } = await params;
  const work = await getWorkBySlug(decodeRouteParam(workSlug));
  return { title: work?.title ?? "Project" };
}

export default async function DirectorWorkDetailPage({
  params,
}: DirectorWorkDetailPageProps) {
  const { slug, workSlug } = await params;
  const director = await getDirectorBySlug(decodeRouteParam(slug));
  const work = await getWorkBySlug(decodeRouteParam(workSlug));

  if (!director || !work || !work.directorIds.includes(director.id)) {
    notFound();
  }

  const [works, directors] = await Promise.all([getPublicWorks(), getDirectors()]);
  const directorWorkOrders = Object.fromEntries(
    directors.map((item) => [item.id, item.workOrder])
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
          <p className="text-xs tracking-[0.2em] text-white/40">{director.name}</p>
          <h1 className="mt-3 max-w-4xl text-2xl font-medium leading-snug tracking-[0.02em] text-white md:text-4xl">
            {work.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-8 md:mt-10">
            <VideoPlayer
              vimeoUrl={work.vimeoUrl}
              vimeoVideoId={work.vimeoVideoId}
              title={work.title}
            />
          </div>
        </FadeIn>

        {work.description ? (
          <FadeIn delay={0.08}>
            <p className="mt-8 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-white/70 md:mt-10 md:text-[15px]">
              {work.description}
            </p>
          </FadeIn>
        ) : null}

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
