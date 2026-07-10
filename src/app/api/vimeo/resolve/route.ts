import { NextResponse } from "next/server";
import { resolveVimeoVideoId } from "@/lib/vimeo/resolve";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url?.trim()) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const videoId = await resolveVimeoVideoId(url);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid Vimeo URL" }, { status: 400 });
  }

  return NextResponse.json({ videoId });
}
