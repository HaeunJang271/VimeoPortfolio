import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { revalidateAfterWorkChange } from "@/lib/revalidate";
import { createWork, getWorks } from "@/services/works";
import type { WorkFormData } from "@/types/work";

export const dynamic = "force-dynamic";

export async function GET() {
  const works = await getWorks();
  return NextResponse.json(works);
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as WorkFormData;
    const work = await createWork(body);
    await revalidateAfterWorkChange({
      slug: work.slug,
      directorIds: work.directorIds,
    });
    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create work";
    const status = message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
