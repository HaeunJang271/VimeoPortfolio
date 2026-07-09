import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
        <p className="text-xs tracking-[0.3em] text-white/40">404</p>
        <h1 className="mt-6 text-2xl font-medium text-white">Page not found</h1>
        <Link
          href="/"
          className="mt-10 text-sm tracking-[0.1em] text-white/50 transition-colors hover:text-white"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
