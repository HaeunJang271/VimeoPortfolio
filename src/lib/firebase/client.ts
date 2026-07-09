import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

async function fetchRuntimeConfig(): Promise<FirebaseClientConfig> {
  const res = await fetch("/api/firebase-config", { cache: "no-store" });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(
      data?.error ??
        "Firebase 설정을 불러오지 못했습니다. Vercel 환경변수를 확인하세요."
    );
  }

  const config = (await res.json()) as FirebaseClientConfig;

  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error(
      "Firebase 설정이 올바르지 않습니다. Vercel Environment Variables를 확인하세요."
    );
  }

  return config;
}

let app: FirebaseApp | null = null;

export function initFirebaseApp(config: FirebaseClientConfig): FirebaseApp {
  if (app) return app;

  if (getApps().length) {
    app = getApps()[0];
    return app;
  }

  app = initializeApp(config);
  return app;
}

export async function getFirebaseAuthAsync(
  config?: FirebaseClientConfig
): Promise<Auth> {
  const resolvedConfig = config ?? (await fetchRuntimeConfig());
  return getAuth(initFirebaseApp(resolvedConfig));
}
