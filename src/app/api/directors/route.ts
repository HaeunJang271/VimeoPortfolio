import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { createDirector, getDirectors } from "@/services/directors";
import type { DirectorFormData } from "@/types/director";

export async function GET() {
  const directors = await getDirectors();
  return NextResponse.json(directors);
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as DirectorFormData;
    const director = await createDirector(body);
    return NextResponse.json(director, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create director";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
