import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadServiceAccountFromFile(): Record<string, string> | null {
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!filePath) return null;

  const resolved = resolve(process.cwd(), filePath);
  if (!existsSync(resolved)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(resolved, "utf8"));
  } catch {
    return null;
  }
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

export function getServiceAccount(): Record<string, string> | null {
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

export function validateServiceAccount(
  serviceAccount: Record<string, string>
): string[] {
  const issues: string[] = [];
  const projectId = serviceAccount.project_id ?? serviceAccount.projectId;
  const clientEmail = serviceAccount.client_email ?? serviceAccount.clientEmail;
  const privateKey = serviceAccount.private_key ?? serviceAccount.privateKey;

  if (!projectId) issues.push("project_id 없음");
  if (!clientEmail) issues.push("client_email 없음");
  if (!privateKey?.includes("BEGIN PRIVATE KEY")) {
    issues.push("private_key 형식이 올바르지 않음");
  }

  return issues;
}

export function isFirebaseAdminConfigured(): boolean {
  return getServiceAccount() !== null;
}
