"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import {
  DeleteDirectorButton,
  EditDirectorLink,
} from "@/components/DeleteDirectorButton";
import { DragHandleIcon } from "@/components/icons/DragHandleIcon";
import type { Director } from "@/types/director";

interface DirectorsOrderManagerProps {
  directors: Director[];
}

interface SortableDirectorRowProps {
  director: Director;
}

function SortableDirectorRow({ director }: SortableDirectorRowProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={director.id}
      dragListener={false}
      dragControls={dragControls}
      className="relative flex cursor-default items-center gap-4 border border-white/10 bg-black p-4"
      whileDrag={{
        borderColor: "rgba(255, 255, 255, 0.28)",
        zIndex: 50,
      }}
      transition={{
        layout: { type: "spring", stiffness: 420, damping: 34 },
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault();
          dragControls.start(event);
        }}
        aria-label={`Reorder ${director.name}`}
        className="shrink-0 cursor-grab touch-none p-2 text-white/35 transition-colors hover:text-white/70 active:cursor-grabbing"
      >
        <DragHandleIcon className="h-4 w-4" />
      </div>

      <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-white/5">
        {director.profileImage ? (
          <Image
            src={director.profileImage}
            alt={director.name}
            fill
            className="object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-white/25">
            —
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">{director.name}</p>
        <p className="mt-1 text-xs text-white/40">{director.slug}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <EditDirectorLink directorId={director.id} />
        <DeleteDirectorButton
          directorId={director.id}
          directorName={director.name}
        />
      </div>
    </Reorder.Item>
  );
}

export function DirectorsOrderManager({ directors }: DirectorsOrderManagerProps) {
  const router = useRouter();
  const [directorIds, setDirectorIds] = useState(
    directors.map((director) => director.id)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const directorsById = useMemo(
    () => new Map(directors.map((director) => [director.id, director])),
    [directors]
  );

  useEffect(() => {
    setDirectorIds(directors.map((director) => director.id));
  }, [directors]);

  function handleReorder(nextIds: string[]) {
    setDirectorIds(nextIds);
    setMessage(null);
  }

  async function handleSaveOrder() {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/directors/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directorIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save order");

      setMessage("Director order saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">
          {message}
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={directorIds}
        onReorder={handleReorder}
        className="flex flex-col gap-3"
      >
        {directorIds.map((directorId) => {
          const director = directorsById.get(directorId);
          if (!director) return null;

          return (
            <SortableDirectorRow key={director.id} director={director} />
          );
        })}
      </Reorder.Group>

      <button
        type="button"
        onClick={handleSaveOrder}
        disabled={saving || directorIds.length === 0}
        className="bg-white px-6 py-2.5 text-sm font-medium tracking-[0.05em] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Order"}
      </button>
    </div>
  );
}
