import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  docToSiteSettings,
  SETTINGS_COLLECTION,
} from "@/lib/firebase/firestore";
import type { SiteSettings, SiteSettingsFormData } from "@/types/settings";

const SETTINGS_DOC_ID = "site";

function getDefaultSettings(): SiteSettings {
  return {
    homepageShowreel: process.env.NEXT_PUBLIC_SHOWREEL_VIMEO_ID ?? "76979871",
    contactEmail: "hello@studio.com",
    phone: "+1 (000) 000-0000",
    instagram: "https://instagram.com/studio",
    logo: null,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseAdminConfigured()) return getDefaultSettings();

  try {
    const doc = await getAdminDb()
      .collection(SETTINGS_COLLECTION)
      .doc(SETTINGS_DOC_ID)
      .get();

    if (!doc.exists) return getDefaultSettings();
    return docToSiteSettings(doc.data());
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return getDefaultSettings();
  }
}

export async function updateSiteSettings(
  formData: SiteSettingsFormData
): Promise<SiteSettings> {
  const docRef = getAdminDb()
    .collection(SETTINGS_COLLECTION)
    .doc(SETTINGS_DOC_ID);

  await docRef.set(
    {
      homepageShowreel: formData.homepageShowreel,
      contactEmail: formData.contactEmail,
      phone: formData.phone,
      instagram: formData.instagram,
      logo: formData.logo || null,
    },
    { merge: true }
  );

  const doc = await docRef.get();
  return docToSiteSettings(doc.data());
}
