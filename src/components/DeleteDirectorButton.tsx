"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export function DeleteDirectorButton({
  directorId,
  directorName,
}: {
  directorId: string;
  directorName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${directorName}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/directors/${directorId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-white/30 transition-colors hover:text-red-400 disabled:opacity-50"
      aria-label={`Delete ${directorName}`}
    >
      <Trash2 size={16} />
    </button>
  );
}

export function EditDirectorLink({ directorId }: { directorId: string }) {
  return (
    <Link
      href={`/admin/directors/${directorId}/edit`}
      className="p-2 text-white/30 transition-colors hover:text-white"
      aria-label="Edit director"
    >
      <Pencil size={16} />
    </Link>
  );
}
