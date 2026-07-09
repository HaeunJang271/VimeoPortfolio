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

function getBuildTimeConfig(): FirebaseClientConfig | null {
  const config: FirebaseClientConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };

  if (!config.apiKey || !config.authDomain || !config.projectId) {
    return null;
  }

  return config;
}

async function fetchRuntimeConfig(): Promise<FirebaseClientConfig> {
  const res = await fetch("/api/firebase-config");

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
let initPromise: Promise<FirebaseApp> | null = null;

async function ensureFirebaseApp(): Promise<FirebaseApp> {
  if (app) return app;

  if (getApps().length) {
    app = getApps()[0];
    return app;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const config = getBuildTimeConfig() ?? (await fetchRuntimeConfig());
      app = initializeApp(config);
      return app;
    })();
  }

  return initPromise;
}

export async function getFirebaseAppAsync(): Promise<FirebaseApp> {
  return ensureFirebaseApp();
}

export async function getFirebaseAuthAsync(): Promise<Auth> {
  const firebaseApp = await ensureFirebaseApp();
  return getAuth(firebaseApp);
}
