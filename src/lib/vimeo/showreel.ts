import { resolveVimeoVideoId } from "./resolve";

export interface ShowreelMedia {
  videoId: string | null;
  posterUrl: string | null;
}

interface VimeoOEmbedResponse {
  thumbnail_url?: string;
}

/**
 * 배경 쇼릴에 필요한 videoId와 포스터(첫 프레임) 이미지를 함께 가져온다.
 * iOS 저전력 모드처럼 자동재생이 막히는 환경에서 검은 화면 대신
 * 정지 이미지를 노출하기 위한 용도.
 */
export async function getShowreelMedia(vimeoUrl: string): Promise<ShowreelMedia> {
  const videoId = await resolveVimeoVideoId(vimeoUrl);
  const source = videoId ? `https://vimeo.com/${videoId}` : vimeoUrl.trim();

  if (!source) return { videoId, posterUrl: null };

  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
      source
    )}&width=1920`;
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });

    if (!res.ok) return { videoId, posterUrl: null };

    const data = (await res.json()) as VimeoOEmbedResponse;
    return { videoId, posterUrl: data.thumbnail_url ?? null };
  } catch {
    return { videoId, posterUrl: null };
  }
}
