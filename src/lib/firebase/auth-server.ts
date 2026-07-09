import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import { isAdmin } from "@/lib/firebase/admin-users";
import {
  getAdminAuth,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase/admin";

export async function getSessionUser(): Promise<DecodedIdToken | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!session) return null;

    return await getAdminAuth().verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

export async function requireSessionUser(): Promise<DecodedIdToken> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdminUser(): Promise<DecodedIdToken> {
  const user = await requireSessionUser();
  const hasAdminRole = await isAdmin(user.uid, user.email);

  if (!hasAdminRole) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function isAdminSession(): Promise<boolean> {
  const user = await getSessionUser();
  if (!user) return false;
  return isAdmin(user.uid, user.email);
}
