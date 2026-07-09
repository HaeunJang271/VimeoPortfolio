import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/types/work";

interface RelatedWorksProps {
  works: Work[];
  heading?: string;
}

export function RelatedWorks({
  works,
  heading = "LATEST WORK",
}: RelatedWorksProps) {
  if (!works.length) return null;

  return (
    <section className="mt-20 border-t border-white/10 pt-12 md:mt-28 md:pt-14">
      <h2 className="mb-8 text-xs tracking-[0.25em] text-white/40 md:mb-10">
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {works.map((work) => (
          <Link
            key={work.id}
            href={`/work/${work.slug}`}
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden bg-white/5">
              {work.thumbnail ? (
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-[10px] tracking-[0.2em] text-white/30">
                    NO THUMBNAIL
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
            </div>
            <p className="mt-3 text-xs leading-snug text-white/80 transition-opacity group-hover:opacity-70 md:text-sm">
              {work.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
