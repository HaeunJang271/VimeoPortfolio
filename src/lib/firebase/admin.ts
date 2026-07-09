import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

export { SESSION_COOKIE_NAME, SESSION_EXPIRES_IN } from "./constants";

let app: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: Storage;

function loadServiceAccountFromFile(): Record<string, string> | null {
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!filePath) return null;

  const resolved = resolve(process.cwd(), filePath);
  if (!existsSync(resolved)) {
    return null;
  }

  return JSON.parse(readFileSync(resolved, "utf8"));
}

function parseServiceAccountJson(raw: string): Record<string, string> | null {
  let value = raw.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    try {
      const unwrapped = JSON.parse(value) as string;
      value = unwrapped;
    } catch {
      value = value.slice(1, -1);
    }
  }

  const candidates = [value, value.replace(/\r?\n/g, "")];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Record<string, string>;
      if (typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch {
      // try next candidate
    }
  }

  return null;
}

function normalizePrivateKey(key: string): string {
  let value = key.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return value.replace(/\\n/g, "\n");
}

function getServiceAccount() {
  const fromFile = loadServiceAccountFromFile();
  if (fromFile) return fromFile;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (json) {
    const parsed = parseServiceAccountJson(json);
    if (parsed) return parsed;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    : undefined;

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  return null;
}

export function getFirebaseAdminHealth(): {
  hasCredentials: boolean;
  initOk: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const serviceAccount = getServiceAccount();

  if (!serviceAccount) {
    issues.push(
      "Firebase Admin 키 없음: FIREBASE_SERVICE_ACCOUNT_KEY 또는 FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY 필요"
    );
    return { hasCredentials: false, initOk: false, issues };
  }

  try {
    getAdminAuth();
    return { hasCredentials: true, initOk: true, issues };
  } catch (error) {
    issues.push(
      error instanceof Error
        ? error.message
        : "Firebase Admin 초기화 실패"
    );
    return { hasCredentials: true, initOk: false, issues };
  }
}

export function isFirebaseAdminConfigured(): boolean {
  return getServiceAccount() !== null;
}

export function getAdminApp(): App {
  if (!getApps().length) {
    const serviceAccount = getServiceAccount();

    if (!serviceAccount) {
      throw new Error(
        "Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_KEY in .env.local"
      );
    }

    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    app = getApps()[0];
  }

  return app;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

export function getAdminStorage(): Storage {
  if (!adminStorage) {
    adminStorage = getStorage(getAdminApp());
  }
  return adminStorage;
}
