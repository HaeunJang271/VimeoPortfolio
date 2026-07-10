"use client";

import Image from "next/image";
import Link from "next/link";
import { directorPath } from "@/utils/paths";
import { motion } from "framer-motion";
import type { Director } from "@/types/director";

interface DirectorCardProps {
  director: Director;
  index?: number;
}

export function DirectorCard({ director, index = 0 }: DirectorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={directorPath(director.slug)}
        className="group block border-b border-white/10 py-8 transition-colors hover:border-white/30 md:py-10"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-5 md:gap-8">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-white/5 md:h-20 md:w-16">
              {director.profileImage ? (
                <Image
                  src={director.profileImage}
                  alt={director.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-medium tracking-[0.04em] text-white md:text-3xl">
                {director.name}
              </h3>
            </div>
          </div>
          <span className="shrink-0 text-xs tracking-[0.2em] text-white/35 transition-transform duration-500 group-hover:translate-x-1">
            VIEW
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
