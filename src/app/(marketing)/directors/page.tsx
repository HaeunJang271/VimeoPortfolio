import type { Metadata } from "next";
import { DirectorCard } from "@/components/DirectorCard";
import { FadeIn } from "@/components/FadeIn";
import { getDirectors } from "@/services/directors";

export const metadata: Metadata = {
  title: "Directors",
};

export default async function DirectorsPage() {
  const directors = await getDirectors();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-32 md:pt-16">
        <FadeIn>
          <h1 className="mb-12 text-xs tracking-[0.3em] text-white/40 md:mb-16">
            DIRECTORS
          </h1>
        </FadeIn>

        <div className="space-y-2">
          {directors.map((director, index) => (
            <DirectorCard key={director.id} director={director} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
