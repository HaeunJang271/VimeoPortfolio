import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { revalidateAfterDirectorChange } from "@/lib/revalidate";
import { updateDirectorsDisplayOrder } from "@/services/directors";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as { directorIds?: string[] };

    if (!Array.isArray(body.directorIds)) {
      return NextResponse.json(
        { error: "directorIds must be an array" },
        { status: 400 }
      );
    }

    await updateDirectorsDisplayOrder(body.directorIds);
    await revalidateAfterDirectorChange();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update director order";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
