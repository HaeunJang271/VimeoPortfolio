"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { FadeIn } from "@/components/FadeIn";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      setError("관리자 권한이 없습니다. 접근이 거부되었습니다.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const auth = getFirebaseAuth();

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        await signOut(auth);

        if (res.status === 403) {
          throw new Error("관리자 권한이 없습니다.");
        }

        throw new Error(data.error ?? "Failed to create session");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn className="w-full max-w-md">
      <div className="mb-12 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40">ADMIN</p>
        <h1 className="mt-4 text-2xl font-medium text-white">Sign In</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">
            EMAIL
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">
            PASSWORD
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white py-3 text-sm font-medium tracking-[0.1em] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </FadeIn>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
