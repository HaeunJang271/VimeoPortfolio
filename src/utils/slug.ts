export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureSlug(text: string, fallbackPrefix = "item"): string {
  const slug = slugify(text);
  if (slug) return slug;

  const seed = encodeURIComponent(text.trim()).replace(/%/g, "").slice(0, 16);
  return seed
    ? `${fallbackPrefix}-${seed.toLowerCase()}`
    : `${fallbackPrefix}-${Date.now().toString(36)}`;
}
