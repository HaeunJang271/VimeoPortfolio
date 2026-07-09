import Link from "next/link";
import { SITE_NAME } from "@/utils/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10 md:py-16">
        <p className="text-xs tracking-[0.15em] text-white/40">
          © {year} {SITE_NAME}
        </p>
        <div className="flex gap-8">
          <Link
            href="/work"
            className="text-xs tracking-[0.15em] text-white/40 transition-colors hover:text-white/70"
          >
            WORK
          </Link>
          <Link
            href="/contact"
            className="text-xs tracking-[0.15em] text-white/40 transition-colors hover:text-white/70"
          >
            CONTACT
          </Link>
        </div>
      </div>
    </footer>
  );
}
