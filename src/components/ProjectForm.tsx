"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { slugify } from "@/utils/slug";
import { normalizeCredit, normalizeCredits } from "@/utils/credits";
import type { Director } from "@/types/director";
import type { Credit, Work, WorkFormData } from "@/types/work";

interface ProjectFormProps {
  work?: Work;
  directors: Director[];
  mode: "create" | "edit";
  initialDirectorIds?: string[];
  returnTo?: string;
}

const emptyCredit: Credit = { role: "", name: "" };

export function ProjectForm({
  work,
  directors,
  mode,
  initialDirectorIds = [],
  returnTo,
}: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<WorkFormData>({
    title: work?.title ?? "",
    slug: work?.slug ?? "",
    thumbnail: work?.thumbnail ?? "",
    vimeoUrl: work?.vimeoUrl ?? "",
    description: work?.description ?? "",
    credits: work?.credits?.length
      ? work.credits.map((credit) => normalizeCredit(credit))
      : [{ ...emptyCredit }],
    displayOrder: work?.displayOrder ?? 0,
    directorIds:
      work?.directorIds ??
      (initialDirectorIds.length > 0 ? initialDirectorIds : []),
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
    credits[index] = normalizeCredit({ ...credits[index], [field]: value });
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

  function toggleDirector(directorId: string) {
    const exists = form.directorIds.includes(directorId);
    updateField(
      "directorIds",
      exists
        ? form.directorIds.filter((id) => id !== directorId)
        : [...form.directorIds, directorId]
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
      body.append("folder", "thumbnails");

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

    const payload: WorkFormData = {
      ...form,
      credits: normalizeCredits(form.credits),
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

      if (
        mode === "create" &&
        initialDirectorIds.length === 1 &&
        data.id
      ) {
        const directorId = initialDirectorIds[0];
        const directorRes = await fetch(`/api/directors/${directorId}`);
        const director = await directorRes.json();

        if (directorRes.ok) {
          const workOrder = [
            ...(director.workOrder ?? []),
            data.id as string,
          ];
          await fetch(`/api/directors/${directorId}/work-order`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workOrder }),
          });
        }
      }

      router.push(returnTo ?? "/admin/works");
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
          <label className="text-xs tracking-[0.15em] text-white/40">
            TITLE
          </label>
          <input
            type="text"
            required
            autoComplete="off"
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
            autoComplete="off"
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
          autoComplete="off"
          placeholder="https://vimeo.com/123456789"
          value={form.vimeoUrl}
          onChange={(e) => updateField("vimeoUrl", e.target.value)}
          className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          DISPLAY ORDER
        </label>
        <input
          type="number"
          min={0}
          autoComplete="off"
          value={form.displayOrder}
          onChange={(e) => updateField("displayOrder", Number(e.target.value))}
          className="admin-number-input w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
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
            autoComplete="off"
            className="hidden"
            onChange={handleThumbnailUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-3">
        <label className="text-xs tracking-[0.15em] text-white/40">
          DIRECTORS
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          {directors.map((director) => {
            const checked = form.directorIds.includes(director.id);

            return (
              <label
                key={director.id}
                className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                  checked
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDirector(director.id)}
                  className="h-4 w-4 accent-white"
                />
                <span>{director.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-[0.15em] text-white/40">
          DESCRIPTION
        </label>
        <textarea
          rows={5}
          autoComplete="off"
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
                placeholder="Director"
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                value={credit.role ?? ""}
                onChange={(e) => updateCredit(index, "role", e.target.value)}
                className="flex-1 border border-white/10 bg-transparent px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Jan'Qui"
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                value={credit.name ?? ""}
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
          onClick={() => router.push(returnTo ?? "/admin/works")}
          className="border border-white/10 px-8 py-3 text-sm tracking-[0.1em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
