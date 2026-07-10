"use client";

import Image from "next/image";
import Link from "next/link";
import { workPath } from "@/utils/paths";
import { motion } from "framer-motion";
import type { Work } from "@/types/work";

interface ProjectCardProps {
  work: Work;
  index?: number;
}

export function ProjectCard({ work, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={workPath(work.slug)} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          {work.thumbnail ? (
            <Image
              src={work.thumbnail}
              alt={work.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs tracking-[0.2em] text-white/30">
                NO THUMBNAIL
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
        </div>
        <h3 className="mt-5 text-sm font-medium tracking-[0.05em] text-white transition-opacity group-hover:opacity-60 md:text-base">
          {work.title}
        </h3>
      </Link>
    </motion.div>
  );
}
