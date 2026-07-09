import Link from "next/link";
import { SITE_NAME } from "@/utils/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/96">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10 md:px-10 md:py-12">
        <Link
          href="/"
          className="text-xs tracking-[0.2em] text-white/60 transition-opacity hover:opacity-60"
        >
          {SITE_NAME}
        </Link>
      </div>
    </footer>
  );
}
