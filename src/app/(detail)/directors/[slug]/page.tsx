import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectorDescription } from "@/components/DirectorDescription";
import { DirectorWorkCard } from "@/components/DirectorWorkCard";
import { FadeIn } from "@/components/FadeIn";
import { getDirectorBySlug, getDirectors, getWorksByDirectorId } from "@/services/directors";

interface DirectorDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const directors = await getDirectors();
  return directors.map((director) => ({ slug: director.slug }));
}

export async function generateMetadata({
  params,
}: DirectorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const director = await getDirectorBySlug(slug);

  return {
    title: director?.name ?? "Director",
  };
}

export default async function DirectorDetailPage({
  params,
}: DirectorDetailPageProps) {
  const { slug } = await params;
  const director = await getDirectorBySlug(slug);

  if (!director) notFound();

  const works = await getWorksByDirectorId(director.id, director.workOrder);

  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6 pb-40 pt-8 md:px-10 md:pb-44 md:pt-12">
        <FadeIn>
          <h1 className="text-3xl font-medium uppercase tracking-[0.04em] text-white md:text-5xl">
            {director.name}
          </h1>
        </FadeIn>

        {(director.description || director.descriptionLinks.length > 0) && (
          <FadeIn delay={0.08}>
            <div className="mt-8 md:mt-10">
              <DirectorDescription
                description={director.description}
                links={director.descriptionLinks}
              />
            </div>
          </FadeIn>
        )}

        {works.length > 0 && (
          <FadeIn delay={0.15}>
            <section className="mt-14 md:mt-20">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
                {works.map((work, index) => (
                  <DirectorWorkCard key={work.id} work={work} index={index} />
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
