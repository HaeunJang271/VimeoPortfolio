import { extractVimeoId } from "@/utils/vimeo";

interface VimeoOEmbedResponse {
  html?: string;
  video_id?: number | string;
}

export async function resolveVimeoVideoId(
  urlOrId: string
): Promise<string | null> {
  const directId = extractVimeoId(urlOrId);
  if (directId) return directId;

  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(trimmed)}`;
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });

    if (!res.ok) return null;

    const data = (await res.json()) as VimeoOEmbedResponse;

    if (data.video_id) {
      return String(data.video_id);
    }

    const match = data.html?.match(/player\.vimeo\.com\/video\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
