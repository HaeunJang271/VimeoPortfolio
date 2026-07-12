import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { docToWork, WORKS_COLLECTION } from "@/lib/firebase/firestore";
import { resolveVimeoVideoId } from "@/lib/vimeo/resolve";
import type { Work, WorkFormData } from "@/types/work";
import { sortWorksByOrder, sortWorksForDisplay } from "@/utils/work-order";

async function prepareWorkPayload(formData: WorkFormData) {
  const vimeoVideoId = await resolveVimeoVideoId(formData.vimeoUrl);

  if (!vimeoVideoId) {
    throw new Error(
      "Vimeo URL을 인식하지 못했습니다. 숫자 ID URL 또는 vimeo.com/share 링크를 사용하세요."
    );
  }

  return {
    title: formData.title,
    slug: formData.slug,
    thumbnail: formData.thumbnail || null,
    vimeoUrl: formData.vimeoUrl.trim(),
    vimeoVideoId,
    description: formData.description,
    credits: formData.credits,
    displayOrder: formData.displayOrder,
    directorIds: formData.directorIds,
    showOnWorkPage: formData.showOnWorkPage,
  };
}

// 아직 수동 정렬하지 않은 새 작품임을 나타내는 음수 값.
// 실제 순서는 createdAt(추가 시각) 기준으로 정하므로 값 자체는 음수이기만 하면 된다.
const UNARRANGED_DISPLAY_ORDER = -1;

export async function getWorks(): Promise<Work[]> {
  if (!isFirebaseAdminConfigured()) return [];

  try {
    const snapshot = await getAdminDb().collection(WORKS_COLLECTION).get();
    const works = snapshot.docs.map((doc) => docToWork(doc.id, doc.data()));
    return sortWorksForDisplay(works);
  } catch (error) {
    console.error("Failed to fetch works:", error);
    return [];
  }
}

export async function getPublicWorks(): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.showOnWorkPage);
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  if (!isFirebaseAdminConfigured()) return null;

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
  if (!isFirebaseAdminConfigured()) return null;

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
  const payload = await prepareWorkPayload(formData);
  const displayOrder =
    formData.displayOrder > 0 ? formData.displayOrder : UNARRANGED_DISPLAY_ORDER;

  const docRef = await getAdminDb()
    .collection(WORKS_COLLECTION)
    .add({
      ...payload,
      displayOrder,
      createdAt: FieldValue.serverTimestamp(),
    });

  const doc = await docRef.get();
  return docToWork(doc.id, doc.data()!);
}

export async function updateWork(
  id: string,
  formData: WorkFormData
): Promise<Work> {
  const docRef = getAdminDb().collection(WORKS_COLLECTION).doc(id);
  const payload = await prepareWorkPayload(formData);

  await docRef.update(payload);

  const doc = await docRef.get();
  return docToWork(doc.id, doc.data()!);
}

export async function deleteWork(id: string): Promise<void> {
  await getAdminDb().collection(WORKS_COLLECTION).doc(id).delete();
}

export async function updateWorksDisplayOrder(workIds: string[]): Promise<void> {
  const db = getAdminDb();
  const batch = db.batch();

  workIds.forEach((workId, index) => {
    const docRef = db.collection(WORKS_COLLECTION).doc(workId);
    batch.update(docRef, { displayOrder: index });
  });

  await batch.commit();
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

export function getRelatedPublicWorks(
  works: Work[],
  currentWork: Work,
  limit = 8
): Work[] {
  return works.filter((work) => work.id !== currentWork.id).slice(0, limit);
}

export function getRelatedDirectorWorks(
  works: Work[],
  currentWork: Work,
  directorId: string,
  workOrder: string[] = [],
  limit = 8
): Work[] {
  const related = works.filter(
    (work) =>
      work.id !== currentWork.id && work.directorIds.includes(directorId)
  );

  return sortWorksByOrder(related, workOrder).slice(0, limit);
}
