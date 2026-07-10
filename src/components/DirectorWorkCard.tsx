"use client";

import Image from "next/image";
import Link from "next/link";
import { getWorkHref } from "@/utils/paths";
import { motion } from "framer-motion";
import type { Credit, Work } from "@/types/work";

interface DirectorWorkCardProps {
  work: Work;
  directorSlug?: string;
  index?: number;
}

function formatCreditLine(credit: Credit): string {
  const role = credit.role.trim();
  const name = credit.name.trim();

  if (!role) return name;
  if (!name) return role;
  return `${role} ${name}`;
}

export function DirectorWorkCard({
  work,
  directorSlug,
  index = 0,
}: DirectorWorkCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={getWorkHref(work, directorSlug)} className="group block">
        <div className="relative aspect-video overflow-hidden bg-white/5">
          {work.thumbnail ? (
            <Image
              src={work.thumbnail}
              alt={work.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs tracking-[0.2em] text-white/30">
                NO THUMBNAIL
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
        </div>

        <h3 className="mt-4 text-sm font-medium uppercase leading-snug tracking-[0.04em] text-white transition-opacity group-hover:opacity-70 md:mt-5 md:text-[15px]">
          {work.title}
        </h3>

        {work.credits.length > 0 ? (
          <div className="mt-2 space-y-1">
            {work.credits.map((credit, creditIndex) => (
              <p
                key={`${credit.role}-${credit.name}-${creditIndex}`}
                className="text-xs leading-relaxed whitespace-pre-wrap text-white/50 md:text-[13px]"
              >
                {formatCreditLine(credit)}
              </p>
            ))}
          </div>
        ) : null}
      </Link>
    </motion.article>
  );
}
