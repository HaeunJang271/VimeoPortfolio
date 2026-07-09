"use client";

import Link from "next/link";
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
        href={`/directors/${director.slug}`}
        className="group block border-b border-white/10 py-8 transition-colors hover:border-white/30 md:py-10"
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-medium tracking-[0.04em] text-white md:text-3xl">
              {director.name}
            </h3>
            {director.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
                {director.description}
              </p>
            )}
          </div>
          <span className="text-xs tracking-[0.2em] text-white/35 transition-transform duration-500 group-hover:translate-x-1">
            VIEW
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
