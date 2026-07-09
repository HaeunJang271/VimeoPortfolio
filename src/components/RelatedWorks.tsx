import Link from "next/link";
import type { Work } from "@/types/work";

interface RelatedWorksProps {
  works: Work[];
}

export function RelatedWorks({ works }: RelatedWorksProps) {
  if (!works.length) return null;

  return (
    <section className="mt-24 border-t border-white/10 pt-10 md:mt-28">
      <h2 className="mb-8 text-xs tracking-[0.2em] text-white/40">
        OTHER PROJECTS
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {works.map((work) => (
          <Link
            key={work.id}
            href={`/work/${work.slug}`}
            className="group border border-white/10 p-5 transition-colors hover:border-white/30"
          >
            <p className="text-sm font-medium text-white transition-opacity group-hover:opacity-70">
              {work.title}
            </p>
            <p className="mt-3 text-xs tracking-[0.16em] text-white/35">
              VIEW PROJECT
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
