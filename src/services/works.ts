import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { docToWork, WORKS_COLLECTION } from "@/lib/firebase/firestore";
import type { Work, WorkFormData } from "@/types/work";

function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY)
  );
}

export async function getWorks(): Promise<Work[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const snapshot = await getAdminDb()
      .collection(WORKS_COLLECTION)
      .orderBy("created_at", "desc")
      .get();

    return snapshot.docs.map((doc) => docToWork(doc.id, doc.data()));
  } catch (error) {
    console.error("Failed to fetch works:", error);
    return [];
  }
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const snapshot = await getAdminDb()
      .collection(WORKS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return docToWork(doc.id, doc.data());
  } catch (error) {
    console.error("Failed to fetch work by slug:", error);
    return null;
  }
}

export async function getWorkById(id: string): Promise<Work | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const doc = await getAdminDb().collection(WORKS_COLLECTION).doc(id).get();

    if (!doc.exists) return null;

    return docToWork(doc.id, doc.data()!);
  } catch (error) {
    console.error("Failed to fetch work by id:", error);
    return null;
  }
}

export async function createWork(formData: WorkFormData): Promise<Work> {
  const docRef = await getAdminDb()
    .collection(WORKS_COLLECTION)
    .add({
      title: formData.title,
      slug: formData.slug,
      thumbnail: formData.thumbnail || null,
      vimeo_url: formData.vimeo_url,
      description: formData.description,
      credits: formData.credits,
      created_at: FieldValue.serverTimestamp(),
    });

  const doc = await docRef.get();
  return docToWork(doc.id, doc.data()!);
}

export async function updateWork(
  id: string,
  formData: WorkFormData
): Promise<Work> {
  const docRef = getAdminDb().collection(WORKS_COLLECTION).doc(id);

  await docRef.update({
    title: formData.title,
    slug: formData.slug,
    thumbnail: formData.thumbnail || null,
    vimeo_url: formData.vimeo_url,
    description: formData.description,
    credits: formData.credits,
  });

  const doc = await docRef.get();
  return docToWork(doc.id, doc.data()!);
}

export async function deleteWork(id: string): Promise<void> {
  await getAdminDb().collection(WORKS_COLLECTION).doc(id).delete();
}

export function getAdjacentWorks(
  works: Work[],
  currentSlug: string
): { prev: Work | null; next: Work | null } {
  const index = works.findIndex((w) => w.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? works[index - 1] : null,
    next: index < works.length - 1 ? works[index + 1] : null,
  };
}
