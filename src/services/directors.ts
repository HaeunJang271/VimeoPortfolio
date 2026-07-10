import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  DIRECTORS_COLLECTION,
  docToDirector,
  docToWork,
  WORKS_COLLECTION,
} from "@/lib/firebase/firestore";
import type { Director, DirectorFormData } from "@/types/director";
import type { Work } from "@/types/work";
import { ensureSlug, slugify } from "@/utils/slug";
import { sortWorksByOrder } from "@/utils/work-order";

async function resolveUniqueDirectorSlug(
  name: string,
  slug: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(slug) || slugify(name) || ensureSlug(name, "director");
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await getDirectorBySlug(candidate);
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function prepareDirectorPayload(formData: DirectorFormData, slug: string) {
  return {
    name: formData.name.trim(),
    slug,
    profileImage: formData.profileImage || null,
    description: formData.description,
    descriptionLinks: formData.descriptionLinks,
    workOrder: formData.workOrder ?? [],
    displayOrder: formData.displayOrder,
  };
}

export async function getDirectors(): Promise<Director[]> {
  if (!isFirebaseAdminConfigured()) return [];

  try {
    const snapshot = await getAdminDb()
      .collection(DIRECTORS_COLLECTION)
      .orderBy("displayOrder", "asc")
      .get();

    return snapshot.docs.map((doc) => docToDirector(doc.id, doc.data()));
  } catch (error) {
    console.error("Failed to fetch directors:", error);
    return [];
  }
}

export async function getDirectorBySlug(slug: string): Promise<Director | null> {
  if (!isFirebaseAdminConfigured()) return null;

  try {
    const snapshot = await getAdminDb()
      .collection(DIRECTORS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return docToDirector(doc.id, doc.data());
  } catch (error) {
    console.error("Failed to fetch director by slug:", error);
    return null;
  }
}

export async function getDirectorById(id: string): Promise<Director | null> {
  if (!isFirebaseAdminConfigured()) return null;

  try {
    const doc = await getAdminDb()
      .collection(DIRECTORS_COLLECTION)
      .doc(id)
      .get();

    if (!doc.exists) return null;
    return docToDirector(doc.id, doc.data()!);
  } catch (error) {
    console.error("Failed to fetch director by id:", error);
    return null;
  }
}

async function getNextDirectorDisplayOrder(): Promise<number> {
  const snapshot = await getAdminDb()
    .collection(DIRECTORS_COLLECTION)
    .orderBy("displayOrder", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) return 0;

  return (snapshot.docs[0].data().displayOrder ?? 0) + 1;
}

export async function createDirector(
  formData: DirectorFormData
): Promise<Director> {
  const slug = await resolveUniqueDirectorSlug(formData.name, formData.slug);
  const displayOrder =
    formData.displayOrder > 0
      ? formData.displayOrder
      : await getNextDirectorDisplayOrder();
  const payload = prepareDirectorPayload(formData, slug);

  const docRef = await getAdminDb()
    .collection(DIRECTORS_COLLECTION)
    .add({
      ...payload,
      displayOrder,
      createdAt: FieldValue.serverTimestamp(),
    });

  const doc = await docRef.get();
  return docToDirector(doc.id, doc.data()!);
}

export async function updateDirector(
  id: string,
  formData: DirectorFormData
): Promise<Director> {
  const slug = await resolveUniqueDirectorSlug(
    formData.name,
    formData.slug,
    id
  );
  const payload = prepareDirectorPayload(formData, slug);
  const docRef = getAdminDb().collection(DIRECTORS_COLLECTION).doc(id);

  await docRef.update(payload);

  const doc = await docRef.get();
  return docToDirector(doc.id, doc.data()!);
}

export async function deleteDirector(id: string): Promise<void> {
  await getAdminDb().collection(DIRECTORS_COLLECTION).doc(id).delete();
}

export async function updateDirectorWorkOrder(
  id: string,
  workOrder: string[]
): Promise<Director> {
  const docRef = getAdminDb().collection(DIRECTORS_COLLECTION).doc(id);

  await docRef.update({ workOrder });

  const doc = await docRef.get();
  return docToDirector(doc.id, doc.data()!);
}

export async function updateDirectorsDisplayOrder(
  directorIds: string[]
): Promise<void> {
  const db = getAdminDb();
  const batch = db.batch();

  directorIds.forEach((directorId, index) => {
    const docRef = db.collection(DIRECTORS_COLLECTION).doc(directorId);
    batch.update(docRef, { displayOrder: index });
  });

  await batch.commit();
}

export async function getWorksByDirectorId(
  directorId: string,
  workOrder: string[] = []
): Promise<Work[]> {
  if (!isFirebaseAdminConfigured()) return [];

  try {
    const snapshot = await getAdminDb()
      .collection(WORKS_COLLECTION)
      .where("directorIds", "array-contains", directorId)
      .get();

    const works = snapshot.docs.map((doc) => docToWork(doc.id, doc.data()));
    return sortWorksByOrder(works, workOrder);
  } catch (error) {
    console.error("Failed to fetch works by director:", error);
    return [];
  }
}
