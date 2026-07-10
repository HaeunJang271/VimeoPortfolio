"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { ensureSlug, slugify } from "@/utils/slug";
import { readJsonResponse } from "@/utils/http";
import type {
  Director,
  DirectorDescriptionLink,
  DirectorFormData,
} from "@/types/director";

interface DirectorFormProps {
  director?: Director;
  mode: "create" | "edit";
}

const emptyLink: DirectorDescriptionLink = { label: "", url: "" };

export function DirectorForm({ director, mode }: DirectorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DirectorFormData>({
    name: director?.name ?? "",
    slug: director?.slug ?? "",
    profileImage: director?.profileImage ?? "",
    description: director?.description ?? "",
    descriptionLinks: director?.descriptionLinks?.length
      ? director.descriptionLinks
      : [{ ...emptyLink }],
    workOrder: director?.workOrder ?? [],
    displayOrder: director?.displayOrder ?? 0,
  });

  function updateField<K extends keyof DirectorFormData>(
    key: K,
    value: DirectorFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    updateField("name", name);
    if (mode === "create") {
      updateField("slug", ensureSlug(name, "director"));
    }
  }

  function updateLink(
    index: number,
    key: keyof DirectorDescriptionLink,
    value: string
  ) {
    const next = [...form.descriptionLinks];
    next[index] = { ...next[index], [key]: value };
    updateField("descriptionLinks", next);
  }

  function addLink() {
    updateField("descriptionLinks", [...form.descriptionLinks, { ...emptyLink }]);
  }

  function removeLink(index: number) {
    updateField(
      "descriptionLinks",
      form.descriptionLinks.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "directors");

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      updateField("profileImage", data.url);
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
      const payload: DirectorFormData = {
        ...form,
        slug: slugify(form.slug) || ensureSlug(form.name, "director"),
        descriptionLinks: form.descriptionLinks.filter(
          (link) => link.label.trim() && link.url.trim()
        ),
      };

      const url =
        mode === "create" ? "/api/directors" : `/api/directors/${director?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readJsonResponse<Director & { error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      router.push("/admin/directors");
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">NAME</label>
          <input
            type="text"
            required
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">SLUG</label>
          <input
            type="text"
            required
            autoComplete="off"
            value={form.slug}
            onChange={(e) => updateField("slug", slugify(e.target.value))}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
      </div>

      <p className="text-xs text-white/35">
        DIRECTORS 목록 순서는 Directors 페이지에서 드래그로 변경합니다.
      </p>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          PROFILE IMAGE
        </label>
        <p className="text-xs text-white/35">
          Directors 목록·상세 페이지에 표시됩니다.
        </p>
        {form.profileImage && (
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden bg-white/5">
            <Image
              src={form.profileImage}
              alt="Director preview"
              fill
              className="object-cover"
            />
          </div>
        )}
        <label className="flex w-full cursor-pointer items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            autoComplete="off"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          DESCRIPTION
        </label>
        <textarea
          rows={7}
          autoComplete="off"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs tracking-[0.15em] text-white/40">
            DESCRIPTION LINKS
          </label>
          <p className="text-xs text-white/30">
            e.g. @2eehyein → https://instagram.com/2eehyein
          </p>
          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
          >
            <Plus size={14} />
            Add Link
          </button>
        </div>

        <div className="space-y-3">
          {form.descriptionLinks.map((link, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="Label"
                autoComplete="off"
                value={link.label}
                onChange={(e) => updateLink(index, "label", e.target.value)}
                className="flex-1 border border-white/10 bg-transparent px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              <input
                type="text"
                placeholder="https://instagram.com/..."
                autoComplete="off"
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                className="flex-[2] border border-white/10 bg-transparent px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              {form.descriptionLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="px-3 text-white/30 transition-colors hover:text-white/70"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-white px-8 py-3 text-sm font-medium tracking-[0.1em] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Director" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/directors")}
          className="border border-white/10 px-8 py-3 text-sm tracking-[0.1em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
