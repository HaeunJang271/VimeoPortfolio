import type { Director } from "@/types/director";
import type { SiteSettings } from "@/types/settings";
import type { Credit, Work } from "@/types/work";
import type { Timestamp } from "firebase-admin/firestore";
import { normalizeCredits } from "@/utils/credits";

export const DIRECTORS_COLLECTION = "directors";
export const WORKS_COLLECTION = "works";
export const SETTINGS_COLLECTION = "settings";

function timestampToIso(value: Timestamp | string | undefined): string {
  return typeof value === "string"
    ? value
    : value?.toDate?.().toISOString() ?? new Date().toISOString();
}

export function docToWork(
  id: string,
  data: FirebaseFirestore.DocumentData
): Work {
  const createdAt = data.createdAt as Timestamp | string | undefined;

  return {
    id,
    title: data.title ?? "",
    slug: data.slug ?? "",
    thumbnail: data.thumbnail ?? null,
    vimeoUrl: data.vimeoUrl ?? "",
    description: data.description ?? "",
    credits: normalizeCredits(data.credits),
    displayOrder: data.displayOrder ?? 0,
    directorIds: data.directorIds ?? [],
    createdAt: timestampToIso(createdAt),
  };
}

export function docToDirector(
  id: string,
  data: FirebaseFirestore.DocumentData
): Director {
  const createdAt = data.createdAt as Timestamp | string | undefined;

  return {
    id,
    name: data.name ?? "",
    slug: data.slug ?? "",
    profileImage: data.profileImage ?? null,
    description: data.description ?? "",
    descriptionLinks: data.descriptionLinks ?? [],
    workOrder: data.workOrder ?? [],
    displayOrder: data.displayOrder ?? 0,
    createdAt: timestampToIso(createdAt),
  };
}

export function docToSiteSettings(
  data: FirebaseFirestore.DocumentData | undefined
): SiteSettings {
  return {
    homepageShowreel: data?.homepageShowreel ?? "",
    contactEmail: data?.contactEmail ?? "hello@studio.com",
    phone: data?.phone ?? "+1 (000) 000-0000",
    instagram: data?.instagram ?? "https://instagram.com/studio",
    logo: data?.logo ?? null,
  };
}
