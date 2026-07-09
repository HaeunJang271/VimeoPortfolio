import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import { getServiceAccount } from "@/lib/firebase/admin-credentials";

export { SESSION_COOKIE_NAME, SESSION_EXPIRES_IN } from "./constants";
export {
  getServiceAccount,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin-credentials";

let app: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: Storage;

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
