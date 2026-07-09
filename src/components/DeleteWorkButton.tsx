"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface DeleteWorkButtonProps {
  workId: string;
  workTitle: string;
}

export function DeleteWorkButton({ workId, workTitle }: DeleteWorkButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${workTitle}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/works/${workId}`, { method: "DELETE" });
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
      aria-label={`Delete ${workTitle}`}
    >
      <Trash2 size={16} />
    </button>
  );
}

export function EditWorkLink({ workId }: { workId: string }) {
  return (
    <Link
      href={`/admin/works/${workId}/edit`}
      className="p-2 text-white/30 transition-colors hover:text-white"
      aria-label="Edit work"
    >
      <Pencil size={16} />
    </Link>
  );
}
