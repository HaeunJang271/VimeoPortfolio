import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  docToSiteSettings,
  SETTINGS_COLLECTION,
} from "@/lib/firebase/firestore";
import type { SiteSettings, SiteSettingsFormData } from "@/types/settings";
import { extractVimeoId } from "@/utils/vimeo";
import { getDefaultCopyrightText } from "@/utils/copyright";

const SETTINGS_DOC_ID = "site";

function getDefaultVimeoUrl(showreel: string): string {
  const id = extractVimeoId(showreel);
  return id ? `https://vimeo.com/${id}` : "https://vimeo.com";
}

function getDefaultSettings(): SiteSettings {
  const homepageShowreel =
    process.env.NEXT_PUBLIC_SHOWREEL_VIMEO_ID ?? "76979871";

  return {
    homepageShowreel,
    contactEmail: "hello@studio.com",
    phone: "+1 (000) 000-0000",
    instagram: "https://instagram.com/studio",
    vimeoUrl: getDefaultVimeoUrl(homepageShowreel),
    logo: null,
    logoHeight: 48,
    copyrightText: getDefaultCopyrightText(),
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

  const logo = formData.logo?.trim() ?? "";
  const logoHeight = Math.min(120, Math.max(24, formData.logoHeight || 48));
  const copyrightText =
    formData.copyrightText?.trim() || getDefaultCopyrightText();

  await docRef.set(
    {
      homepageShowreel: formData.homepageShowreel,
      contactEmail: formData.contactEmail,
      phone: formData.phone,
      instagram: formData.instagram,
      vimeoUrl: formData.vimeoUrl,
      logo: logo ? logo : FieldValue.delete(),
      logoHeight,
      copyrightText,
    },
    { merge: true }
  );

  const doc = await docRef.get();
  return docToSiteSettings(doc.data());
}
