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
    return normalizeServiceAccount(
      JSON.parse(readFileSync(resolved, "utf8")) as Record<string, string>
    );
  } catch {
    return null;
  }
}

export function normalizePrivateKey(key: string): string {
  let value = key.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    try {
      value = JSON.parse(value) as string;
    } catch {
      value = value.slice(1, -1).trim();
    }
  }

  let prev = "";
  while (prev !== value) {
    prev = value;
    value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
  }

  value = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (!value.endsWith("\n")) {
    value += "\n";
  }

  return value;
}

function normalizeServiceAccount(
  account: Record<string, string>
): Record<string, string> {
  const privateKey = account.private_key ?? account.privateKey;

  if (typeof privateKey === "string") {
    const normalized = normalizePrivateKey(privateKey);
    return {
      ...account,
      private_key: normalized,
      privateKey: normalized,
    };
  }

  return account;
}

function parseServiceAccountJson(raw: string): Record<string, string> | null {
  let value = raw.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    try {
      value = JSON.parse(value) as string;
    } catch {
      value = value.slice(1, -1);
    }
  }

  const candidates = [value, value.replace(/\r?\n/g, "")];

  for (const candidate of candidates) {
    try {
      let parsed: unknown = JSON.parse(candidate);

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (parsed && typeof parsed === "object") {
        return normalizeServiceAccount(parsed as Record<string, string>);
      }
    } catch {
      // try next candidate
    }
  }

  return null;
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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (projectId && clientEmail && privateKey) {
    return normalizeServiceAccount({
      type: "service_account",
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    });
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
    issues.push("private_key에 -----BEGIN PRIVATE KEY----- 가 없음");
  }
  if (privateKey && !privateKey.includes("END PRIVATE KEY")) {
    issues.push("private_key에 -----END PRIVATE KEY----- 가 없음");
  }

  return issues;
}

export function isFirebaseAdminConfigured(): boolean {
  return getServiceAccount() !== null;
}
