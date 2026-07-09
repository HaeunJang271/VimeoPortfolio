import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { ProjectCard } from "@/components/ProjectCard";
import { getWorks } from "@/services/works";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const works = await getWorks();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <FadeIn>
            <h1 className="mb-16 text-sm font-medium tracking-[0.3em] text-white/40 md:mb-24">
              SELECTED WORK
            </h1>
          </FadeIn>

          {works.length === 0 ? (
            <FadeIn delay={0.1}>
              <p className="text-sm text-white/40">
                No projects yet. Add works from the admin dashboard.
              </p>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
              {works.map((work, index) => (
                <ProjectCard key={work.id} work={work} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
