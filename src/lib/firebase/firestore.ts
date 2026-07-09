import type { Work } from "@/types/work";
import type { Timestamp } from "firebase-admin/firestore";

export const WORKS_COLLECTION = "works";

export function docToWork(
  id: string,
  data: FirebaseFirestore.DocumentData
): Work {
  const createdAt = data.created_at as Timestamp | string | undefined;

  return {
    id,
    title: data.title ?? "",
    slug: data.slug ?? "",
    thumbnail: data.thumbnail ?? null,
    vimeo_url: data.vimeo_url ?? "",
    description: data.description ?? "",
    credits: data.credits ?? [],
    created_at:
      typeof createdAt === "string"
        ? createdAt
        : createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}
