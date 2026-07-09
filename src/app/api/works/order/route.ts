import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { updateWorksDisplayOrder } from "@/services/works";

export async function PUT(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as { workIds?: string[] };

    if (!Array.isArray(body.workIds)) {
      return NextResponse.json(
        { error: "workIds must be an array" },
        { status: 400 }
      );
    }

    await updateWorksDisplayOrder(body.workIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update work order";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
