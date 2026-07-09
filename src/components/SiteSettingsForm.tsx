"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import type { SiteSettings, SiteSettingsFormData } from "@/types/settings";

interface SiteSettingsFormProps {
  settings: SiteSettings;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SiteSettingsFormData>({
    homepageShowreel: settings.homepageShowreel,
    contactEmail: settings.contactEmail,
    phone: settings.phone,
    instagram: settings.instagram,
    logo: settings.logo ?? "",
  });

  function updateField<K extends keyof SiteSettingsFormData>(
    key: K,
    value: SiteSettingsFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "logos");

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      updateField("logo", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      {error && (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          HOMEPAGE SHOWREEL
        </label>
        <input
          type="text"
          required
          autoComplete="off"
          value={form.homepageShowreel}
          onChange={(e) => updateField("homepageShowreel", e.target.value)}
          className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">EMAIL</label>
          <input
            type="text"
            required
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            value={form.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">PHONE</label>
          <input
            type="text"
            required
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          INSTAGRAM
        </label>
        <input
          type="text"
          required
          autoComplete="off"
          value={form.instagram}
          onChange={(e) => updateField("instagram", e.target.value)}
          className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">LOGO</label>
        {form.logo && (
          <div className="relative h-20 w-48 overflow-hidden bg-white/5 p-4">
            <Image
              src={form.logo}
              alt="Logo preview"
              fill
              className="object-contain p-4"
            />
          </div>
        )}
        <label className="flex w-full cursor-pointer items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Logo"}
          <input
            type="file"
            accept="image/*"
            autoComplete="off"
            className="hidden"
            onChange={handleLogoUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-white px-8 py-3 text-sm font-medium tracking-[0.1em] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
