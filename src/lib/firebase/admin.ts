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

function getServiceAccount() {
  const fromFile = loadServiceAccountFromFile();
  if (fromFile) return fromFile;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  return null;
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
