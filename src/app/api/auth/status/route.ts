import { NextResponse } from "next/server";
import { getFirebaseAdminHealth } from "@/lib/firebase/admin";
import { getFirebaseConfigFromEnv } from "@/lib/firebase/server-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const clientConfig = getFirebaseConfigFromEnv();
  const adminHealth = getFirebaseAdminHealth();

  return NextResponse.json({
    clientConfig: !!clientConfig,
    adminCredentials: adminHealth.hasCredentials,
    adminInit: adminHealth.initOk,
    issues: adminHealth.issues,
    ready: !!clientConfig && adminHealth.initOk,
  });
}
