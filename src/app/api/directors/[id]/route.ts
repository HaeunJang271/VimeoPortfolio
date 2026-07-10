import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { revalidateAfterDirectorChange } from "@/lib/revalidate";
import {
  deleteDirector,
  getDirectorById,
  updateDirector,
} from "@/services/directors";
import type { DirectorFormData } from "@/types/director";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const director = await getDirectorById(id);

  if (!director) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(director);
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const body = (await request.json()) as DirectorFormData;
    const existing = await getDirectorById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const director = await updateDirector(id, body);
    await revalidateAfterDirectorChange({
      slug: director.slug,
      previousSlug: existing.slug !== director.slug ? existing.slug : undefined,
    });
    return NextResponse.json(director);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update director";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const existing = await getDirectorById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteDirector(id);
    await revalidateAfterDirectorChange({ slug: existing.slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete director";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
