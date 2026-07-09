"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { readJsonResponse } from "@/utils/http";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      setError("관리자 권한이 없습니다. 접근이 거부되었습니다.");
      void fetch("/api/auth/logout", { method: "POST" });
    }

    void fetch("/api/auth/status", { cache: "no-store" })
      .then(async (res) => {
        const data = await readJsonResponse<{
          ready?: boolean;
          issues?: string[];
        }>(res);

        if (!data.ready && data.issues?.length) {
          setError(data.issues.join(" / "));
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        }
      });
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await readJsonResponse<{ error?: string }>(res);

      if (!res.ok) {
        throw new Error(data.error ?? "로그인에 실패했습니다.");
      }

      window.location.assign("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
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

        <p className="text-center text-[10px] tracking-wider text-white/30">
          Login v3 · server-only
        </p>
      </form>
    </FadeIn>
  );
}
