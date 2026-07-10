import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { revalidateAfterWorkChange } from "@/lib/revalidate";
import { deleteWork, getWorkById, updateWork } from "@/services/works";
import type { WorkFormData } from "@/types/work";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const work = await getWorkById(id);

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(work);
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const body = (await request.json()) as WorkFormData;
    const existing = await getWorkById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const work = await updateWork(id, body);
    await revalidateAfterWorkChange({
      slug: work.slug,
      previousSlug: existing.slug !== work.slug ? existing.slug : undefined,
      directorIds: Array.from(
        new Set([...existing.directorIds, ...work.directorIds])
      ),
    });
    return NextResponse.json(work);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update work";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const existing = await getWorkById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteWork(id);
    await revalidateAfterWorkChange({
      slug: existing.slug,
      directorIds: existing.directorIds,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete work";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
