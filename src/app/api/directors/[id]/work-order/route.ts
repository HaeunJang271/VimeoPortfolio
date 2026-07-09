import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { updateDirectorWorkOrder } from "@/services/directors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const body = (await request.json()) as { workOrder?: string[] };

    if (!Array.isArray(body.workOrder)) {
      return NextResponse.json(
        { error: "workOrder must be an array" },
        { status: 400 }
      );
    }

    const director = await updateDirectorWorkOrder(id, body.workOrder);
    return NextResponse.json(director);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update work order";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
