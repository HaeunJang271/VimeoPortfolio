import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ProjectCard } from "@/components/ProjectCard";
import { getWorks } from "@/services/works";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const works = await getWorks();

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-7xl px-6 pb-40 pt-28 md:px-10 md:pb-44 md:pt-32">
        <FadeIn>
          <h1 className="mb-12 text-xs tracking-[0.3em] text-white/40 md:mb-16">
            WORK
          </h1>
        </FadeIn>

        {works.length === 0 ? (
          <FadeIn delay={0.1}>
            <p className="text-sm text-white/45">No projects published yet.</p>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {works.map((work, index) => (
              <ProjectCard key={work.id} work={work} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
