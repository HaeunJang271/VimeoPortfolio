import { NextResponse } from "next/server";
import {
  getFirebaseConfigFromEnv,
  getMissingFirebaseClientEnvKeys,
} from "@/lib/firebase/server-config";
import {
  getServiceAccount,
  validateServiceAccount,
} from "@/lib/firebase/admin-credentials";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const clientConfig = getFirebaseConfigFromEnv();
  const issues: string[] = [];
  const serviceAccount = getServiceAccount();

  if (!clientConfig) {
    issues.push("NEXT_PUBLIC_FIREBASE_* 환경변수 6개 필요");
    issues.push(...getMissingFirebaseClientEnvKeys().map((key) => `누락: ${key}`));
  }

  if (!serviceAccount) {
    issues.push(
      "Firebase Admin 키 없음: FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY 필요"
    );

    return NextResponse.json({
      clientConfig: !!clientConfig,
      adminCredentials: false,
      adminInit: false,
      issues,
      ready: false,
    });
  }

  issues.push(...validateServiceAccount(serviceAccount));

  if (issues.length > 0) {
    return NextResponse.json({
      clientConfig: !!clientConfig,
      adminCredentials: true,
      adminInit: false,
      issues,
      ready: false,
    });
  }

  try {
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    getAdminAuth();

    return NextResponse.json({
      clientConfig: !!clientConfig,
      adminCredentials: true,
      adminInit: true,
      issues: [],
      ready: !!clientConfig,
    });
  } catch (error) {
    issues.push(
      error instanceof Error ? error.message : "Firebase Admin 초기화 실패"
    );

    return NextResponse.json({
      clientConfig: !!clientConfig,
      adminCredentials: true,
      adminInit: false,
      issues,
      ready: false,
    });
  }
}
