/**
 * Extract Vimeo video ID from various URL formats.
 */
export function extractVimeoId(urlOrId: string): string | null {
  if (!urlOrId) return null;

  const trimmed = urlOrId.trim();

  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getVimeoEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "1",
    loop: "1",
    background: "1",
    title: "0",
    byline: "0",
    portrait: "0",
  });

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

export function getVimeoPlayerUrl(videoId: string): string {
  const params = new URLSearchParams({
    title: "0",
    byline: "0",
    portrait: "0",
  });

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}
