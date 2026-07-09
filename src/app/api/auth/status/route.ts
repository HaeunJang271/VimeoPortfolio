import { NextResponse } from "next/server";
import { getFirebaseConfigFromEnv } from "@/lib/firebase/server-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { getFirebaseAdminHealth } = await import("@/lib/firebase/admin");
    const clientConfig = getFirebaseConfigFromEnv();
    const adminHealth = getFirebaseAdminHealth();

    return NextResponse.json({
      clientConfig: !!clientConfig,
      adminCredentials: adminHealth.hasCredentials,
      adminInit: adminHealth.initOk,
      issues: adminHealth.issues,
      ready: !!clientConfig && adminHealth.initOk,
    });
  } catch (error) {
    return NextResponse.json(
      {
        clientConfig: false,
        adminCredentials: false,
        adminInit: false,
        issues: [
          error instanceof Error
            ? error.message
            : "서버 상태 확인 중 오류가 발생했습니다.",
        ],
        ready: false,
      },
      { status: 500 }
    );
  }
}
