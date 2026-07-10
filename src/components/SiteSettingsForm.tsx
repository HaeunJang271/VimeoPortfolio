"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import type { SiteSettings, SiteSettingsFormData } from "@/types/settings";
import { getDefaultCopyrightText } from "@/utils/copyright";

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
    vimeoUrl: settings.vimeoUrl,
    logo: settings.logo ?? "",
    logoHeight: settings.logoHeight,
    copyrightText: settings.copyrightText,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [removingLogo, setRemovingLogo] = useState(false);

  useEffect(() => {
    setForm({
      homepageShowreel: settings.homepageShowreel,
      contactEmail: settings.contactEmail,
      phone: settings.phone,
      instagram: settings.instagram,
      vimeoUrl: settings.vimeoUrl,
      logo: settings.logo ?? "",
      logoHeight: settings.logoHeight,
      copyrightText: settings.copyrightText,
    });
  }, [settings]);

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

  async function handleRemoveLogo() {
    const previousLogo = form.logo;
    const nextForm = { ...form, logo: "" };
    setForm(nextForm);
    setRemovingLogo(true);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to remove logo");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove logo");
      setForm((prev) => ({ ...prev, logo: previousLogo }));
    } finally {
      setRemovingLogo(false);
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
        <label className="text-xs tracking-[0.15em] text-white/40">VIMEO</label>
        <input
          type="text"
          required
          autoComplete="off"
          placeholder="https://vimeo.com/..."
          value={form.vimeoUrl}
          onChange={(e) => updateField("vimeoUrl", e.target.value)}
          className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">LOGO</label>
        <p className="text-xs text-white/35">
          업로드 시 메인 하단 MAKMALLO 텍스트 대신 로고 이미지가 표시됩니다.
          아래 높이(px)로 크기를 조절할 수 있습니다.
        </p>
        {form.logo && (
          <div
            className="relative w-48 overflow-hidden bg-white/5 p-4"
            style={{ height: `${form.logoHeight}px` }}
          >
            <Image
              src={form.logo}
              alt="Logo preview"
              fill
              className="object-contain p-4"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={removingLogo}
              aria-label="Remove logo"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white/80 transition-colors hover:bg-black hover:text-white disabled:opacity-50"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <label className="flex w-full cursor-pointer items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Logo"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            autoComplete="off"
            className="hidden"
            onChange={handleLogoUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          LOGO HEIGHT (PX)
        </label>
        <input
          type="number"
          min={24}
          max={120}
          autoComplete="off"
          value={form.logoHeight}
          onChange={(e) =>
            updateField("logoHeight", Number(e.target.value) || 48)
          }
          className="admin-number-input w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />
        <p className="text-xs text-white/35">
          PNG 해상도를 올리는 것보다 이 값으로 조절하는 것이 더 편합니다.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          COPYRIGHT
        </label>
        <input
          type="text"
          required
          autoComplete="off"
          placeholder={getDefaultCopyrightText()}
          value={form.copyrightText}
          onChange={(e) => updateField("copyrightText", e.target.value)}
          className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />
        <p className="text-xs text-white/35">
          하단 저작권 문구입니다. 연도는 직접 수정하세요. 예: © 2026 MAKMALLO.
          ALL RIGHTS RESERVED.
        </p>
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
