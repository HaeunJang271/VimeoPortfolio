import { BRAND_NAME } from "@/utils/constants";

export function getDefaultCopyrightText(
  brandName: string = BRAND_NAME,
  year: number = new Date().getFullYear()
): string {
  return `© ${year} ${brandName}. ALL RIGHTS RESERVED.`;
}

export function splitCopyrightForMobile(text: string): {
  line1: string;
  line2: string;
} {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.*?)\s+(ALL RIGHTS RESERVED\.?)\s*$/i);

  if (match) {
    return {
      line1: match[1].trim(),
      line2: match[2].trim().replace(/\.$/, "") + ".",
    };
  }

  return { line1: trimmed, line2: "" };
}
