import { NextResponse } from "next/server";
import { getFirebaseConfigFromEnv } from "@/lib/firebase/server-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getFirebaseConfigFromEnv();

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Firebase 설정이 서버에 없습니다. Vercel Environment Variables에 NEXT_PUBLIC_FIREBASE_* 를 등록하세요.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
