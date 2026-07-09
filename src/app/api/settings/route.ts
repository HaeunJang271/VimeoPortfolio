import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/firebase/auth-server";
import { getSiteSettings, updateSiteSettings } from "@/services/settings";
import type { SiteSettingsFormData } from "@/types/settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as SiteSettingsFormData;
    const settings = await updateSiteSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update settings";
    const status =
      message === "Unauthorized" || message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
