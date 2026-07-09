import { getAdminDb } from "@/lib/firebase/admin";
import type { AdminRecord, UserRole } from "@/types/user";

export const ADMINS_COLLECTION = "admins";

function getAllowedEmailsFromEnv(): string[] {
  return (
    process.env.ADMIN_EMAILS?.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

export async function getAdminRecord(uid: string): Promise<AdminRecord | null> {
  try {
    const doc = await getAdminDb().collection(ADMINS_COLLECTION).doc(uid).get();

    if (!doc.exists) return null;

    const data = doc.data();
    if (data?.role !== "admin") return null;

    return {
      uid,
      email: data.email ?? "",
      role: data.role as UserRole,
      created_at: data.created_at?.toDate?.()?.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function isAdmin(uid: string, email?: string): Promise<boolean> {
  const record = await getAdminRecord(uid);
  if (record) return true;

  if (!email) return false;

  const allowedEmails = getAllowedEmailsFromEnv();
  return allowedEmails.includes(email.toLowerCase());
}
