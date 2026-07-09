import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { ProjectCard } from "@/components/ProjectCard";
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

  const works = await getWorksByDirectorId(director.id);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10 md:pb-32 md:pt-12">
        <FadeIn>
          <h1 className="text-3xl font-medium tracking-[0.03em] text-white md:text-5xl">
            {director.name}
          </h1>
        </FadeIn>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[320px_1fr] md:gap-16">
          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
              {director.profileImage ? (
                <Image
                  src={director.profileImage}
                  alt={director.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs tracking-[0.2em] text-white/25">
                  NO IMAGE
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="max-w-3xl">
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/65 md:text-base">
                {director.description}
              </p>

              {director.descriptionLinks.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {director.descriptionLinks.map((link) => (
                    <Link
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm tracking-[0.08em] text-white/50 underline underline-offset-4 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-16 border-t border-white/10 pt-10 md:mt-24">
            <h2 className="mb-10 text-xs tracking-[0.2em] text-white/40">
              SELECTED WORK
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
              {works.map((work, index) => (
                <ProjectCard key={work.id} work={work} index={index} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
