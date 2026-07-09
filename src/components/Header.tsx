"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/utils/constants";

const navItems = [
  { href: "/directors", label: "DIRECTORS" },
  { href: "/work", label: "WORK" },
  { href: "/contact", label: "CONTACT" },
];

export function Header() {
  const pathname = usePathname();
  const isMarketingPage =
    pathname === "/" ||
    pathname.startsWith("/directors") ||
    pathname.startsWith("/work") ||
    pathname.startsWith("/contact");
  const isDetailPage =
    pathname.startsWith("/directors/") || pathname.startsWith("/work/");

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isMarketingPage && !isDetailPage
          ? "mix-blend-difference"
          : "bg-black/92 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-60 md:text-base"
        >
          {SITE_NAME}
        </Link>

        <nav className="flex items-center gap-8 md:gap-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-60 md:text-sm ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "opacity-100"
                  : "opacity-70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
