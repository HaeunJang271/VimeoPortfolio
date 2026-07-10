export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

export function directorPath(slug: string): string {
  return `/directors/${encodeURIComponent(slug)}`;
}

export function workPath(slug: string): string {
  return `/work/${encodeURIComponent(slug)}`;
}

export function directorWorkPath(directorSlug: string, workSlug: string): string {
  return `/directors/${encodeURIComponent(directorSlug)}/works/${encodeURIComponent(workSlug)}`;
}

export function getWorkHref(
  work: { slug: string },
  directorSlug?: string
): string {
  if (directorSlug) {
    return directorWorkPath(directorSlug, work.slug);
  }

  return workPath(work.slug);
}
