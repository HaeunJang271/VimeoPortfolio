"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { DeleteWorkButton, EditWorkLink } from "@/components/DeleteWorkButton";
import { DragHandleIcon } from "@/components/icons/DragHandleIcon";
import type { Work } from "@/types/work";

interface WorksOrderManagerProps {
  works: Work[];
  directorNamesById: Record<string, string>;
}

interface SortableWorkRowProps {
  work: Work;
  directorNamesById: Record<string, string>;
}

function SortableWorkRow({ work, directorNamesById }: SortableWorkRowProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={work.id}
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
        aria-label={`Reorder ${work.title}`}
        className="shrink-0 cursor-grab touch-none p-2 text-white/35 transition-colors hover:text-white/70 active:cursor-grabbing"
      >
        <DragHandleIcon className="h-4 w-4" />
      </div>

      <div className="relative h-14 w-24 shrink-0 overflow-hidden bg-white/5">
        {work.thumbnail ? (
          <Image
            src={work.thumbnail}
            alt={work.title}
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
        <p className="truncate text-sm text-white">{work.title}</p>
        <p className="mt-1 text-xs text-white/40">{work.slug}</p>
        <p className="mt-1 text-xs text-white/35">
          {work.directorIds
            .map((id) => directorNamesById[id])
            .filter(Boolean)
            .join(", ") || "—"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <EditWorkLink workId={work.id} />
        <DeleteWorkButton workId={work.id} workTitle={work.title} />
      </div>
    </Reorder.Item>
  );
}

export function WorksOrderManager({
  works,
  directorNamesById,
}: WorksOrderManagerProps) {
  const router = useRouter();
  const [workIds, setWorkIds] = useState(works.map((work) => work.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const worksById = useMemo(
    () => new Map(works.map((work) => [work.id, work])),
    [works]
  );

  useEffect(() => {
    setWorkIds(works.map((work) => work.id));
  }, [works]);

  function handleReorder(nextIds: string[]) {
    setWorkIds(nextIds);
    setMessage(null);
  }

  async function handleSaveOrder() {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/works/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save order");

      setMessage("Work order saved.");
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
        values={workIds}
        onReorder={handleReorder}
        className="flex flex-col gap-3"
      >
        {workIds.map((workId) => {
          const work = worksById.get(workId);
          if (!work) return null;

          return (
            <SortableWorkRow
              key={work.id}
              work={work}
              directorNamesById={directorNamesById}
            />
          );
        })}
      </Reorder.Group>

      <button
        type="button"
        onClick={handleSaveOrder}
        disabled={saving || workIds.length === 0}
        className="bg-white px-6 py-2.5 text-sm font-medium tracking-[0.05em] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Order"}
      </button>
    </div>
  );
}
