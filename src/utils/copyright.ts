import { BRAND_NAME } from "@/utils/constants";

export function getDefaultCopyrightText(
  brandName: string = BRAND_NAME,
  year: number = new Date().getFullYear()
): string {
  return `© ${year} ${brandName}. ALL RIGHTS RESERVED.`;
}
