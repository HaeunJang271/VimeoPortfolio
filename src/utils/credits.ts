import type { Credit } from "@/types/work";

export function normalizeCredit(credit: Partial<Credit> | null | undefined): Credit {
  return {
    role: credit?.role?.trim() ?? "",
    name: credit?.name?.trim() ?? "",
  };
}

export function formatCreditLine(credit: Credit): string {
  const role = credit.role.trim();
  const name = credit.name.trim();

  if (!role) return name;
  if (!name) return role;
  return `${role} ㅣ ${name}`;
}

export function normalizeCredits(
  credits: Array<Partial<Credit> | null | undefined> | null | undefined
): Credit[] {
  if (!Array.isArray(credits)) return [];

  return credits
    .map((credit) => normalizeCredit(credit))
    .filter((credit) => credit.role || credit.name);
}
