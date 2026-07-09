"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { slugify } from "@/utils/slug";
import type { Credit, Work, WorkFormData } from "@/types/work";

interface ProjectFormProps {
  work?: Work;
  mode: "create" | "edit";
}

const emptyCredit: Credit = { role: "", name: "" };

export function ProjectForm({ work, mode }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<WorkFormData>({
    title: work?.title ?? "",
    slug: work?.slug ?? "",
    thumbnail: work?.thumbnail ?? "",
    vimeo_url: work?.vimeo_url ?? "",
    description: work?.description ?? "",
    credits: work?.credits?.length ? work.credits : [{ ...emptyCredit }],
  });

  function updateField<K extends keyof WorkFormData>(
    key: K,
    value: WorkFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    updateField("title", title);
    if (mode === "create") {
      updateField("slug", slugify(title));
    }
  }

  function updateCredit(index: number, field: keyof Credit, value: string) {
    const credits = [...form.credits];
    credits[index] = { ...credits[index], [field]: value };
    updateField("credits", credits);
  }

  function addCredit() {
    updateField("credits", [...form.credits, { ...emptyCredit }]);
  }

  function removeCredit(index: number) {
    updateField(
      "credits",
      form.credits.filter((_, i) => i !== index)
    );
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      updateField("thumbnail", data.url);
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

    const payload = {
      ...form,
      credits: form.credits.filter((c) => c.role.trim() && c.name.trim()),
    };

    try {
      const url =
        mode === "create" ? "/api/works" : `/api/works/${work?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      router.push("/admin/works");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">
            TITLE
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs tracking-[0.15em] text-white/40">
            SLUG
          </label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => updateField("slug", slugify(e.target.value))}
            className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          VIMEO URL
        </label>
        <input
          type="text"
          required
          placeholder="https://vimeo.com/123456789"
          value={form.vimeo_url}
          onChange={(e) => updateField("vimeo_url", e.target.value)}
          className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          THUMBNAIL
        </label>

        {form.thumbnail && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
            <Image
              src={form.thumbnail}
              alt="Thumbnail preview"
              fill
              className="object-cover"
            />
          </div>
        )}

        <label className="flex w-full cursor-pointer items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Thumbnail"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          DESCRIPTION
        </label>
        <textarea
          rows={5}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs tracking-[0.15em] text-white/40">
            CREDITS
          </label>
          <button
            type="button"
            onClick={addCredit}
            className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
          >
            <Plus size={14} />
            Add Credit
          </button>
        </div>

        <div className="space-y-3">
          {form.credits.map((credit, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="Role"
                value={credit.role}
                onChange={(e) => updateCredit(index, "role", e.target.value)}
                className="flex-1 border border-white/10 bg-transparent px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Name"
                value={credit.name}
                onChange={(e) => updateCredit(index, "name", e.target.value)}
                className="flex-1 border border-white/10 bg-transparent px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              {form.credits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCredit(index)}
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
          {loading ? "Saving..." : mode === "create" ? "Create Work" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/works")}
          className="border border-white/10 px-8 py-3 text-sm tracking-[0.1em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
