export async function readJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  const text = await res.text();

  if (text.trimStart().startsWith("<")) {
    throw new Error(
      "서버 API가 HTML을 반환했습니다. Vercel Deployment Protection을 끄거나 Production URL로 접속하세요."
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 120) || "서버 응답을 처리하지 못했습니다.");
  }
}
