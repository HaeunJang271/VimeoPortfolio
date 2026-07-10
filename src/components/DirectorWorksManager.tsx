"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Plus } from "lucide-react";
import { DragHandleIcon } from "@/components/icons/DragHandleIcon";
import { getOrderedWorkIds } from "@/utils/work-order";
import type { Work } from "@/types/work";

interface DirectorWorksManagerProps {
  directorId: string;
  directorName: string;
  works: Work[];
  initialWorkOrder: string[];
}

interface SortableDirectorWorkRowProps {
  work: Work;
}

function SortableDirectorWorkRow({ work }: SortableDirectorWorkRowProps) {
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
      </div>

      <Link
        href={`/admin/works/${work.id}/edit`}
        className="shrink-0 border border-white/10 px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
      >
        Edit
      </Link>
    </Reorder.Item>
  );
}

export function DirectorWorksManager({
  directorId,
  directorName,
  works,
  initialWorkOrder,
}: DirectorWorksManagerProps) {
  const router = useRouter();
  const [workIds, setWorkIds] = useState(() =>
    getOrderedWorkIds(works, initialWorkOrder)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const worksById = useMemo(
    () => new Map(works.map((work) => [work.id, work])),
    [works]
  );

  useEffect(() => {
    setWorkIds(getOrderedWorkIds(works, initialWorkOrder));
  }, [works, initialWorkOrder]);

  function handleReorder(nextIds: string[]) {
    setWorkIds(nextIds);
    setMessage(null);
  }

  async function handleSaveOrder() {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/directors/${directorId}/work-order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrder: workIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save order");

      setMessage("Portfolio order saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-16 border-t border-white/10 pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-white">Portfolio Works</h2>
          <p className="mt-2 text-sm text-white/40">
            Manage and reorder works shown on {directorName}&apos;s page.
            Director-only works do not appear on the WORK page.
          </p>
        </div>
        <Link
          href={`/admin/works/new?directorId=${directorId}`}
          className="flex items-center gap-2 border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-white/35"
        >
          <Plus size={16} />
          Add Work
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">
          {message}
        </div>
      )}

      {workIds.length === 0 ? (
        <div className="border border-white/10 p-10 text-center">
          <p className="text-sm text-white/40">No works linked to this director yet.</p>
          <Link
            href={`/admin/works/new?directorId=${directorId}`}
            className="mt-4 inline-block text-sm text-white underline underline-offset-4"
          >
            Add the first work
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <Reorder.Group
            axis="y"
            values={workIds}
            onReorder={handleReorder}
            className="flex flex-col gap-3"
          >
            {workIds.map((workId) => {
              const work = worksById.get(workId);
              if (!work) return null;

              return <SortableDirectorWorkRow key={work.id} work={work} />;
            })}
          </Reorder.Group>

          <button
            type="button"
            onClick={handleSaveOrder}
            disabled={saving}
            className="mt-4 bg-white px-6 py-2.5 text-sm font-medium tracking-[0.05em] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      )}
    </section>
  );
}
