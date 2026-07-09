export async function readJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  const text = await res.text();

  if (text.trimStart().startsWith("<")) {
    throw new Error(
      "서버 API 응답 오류입니다. 배포가 완료됐는지 확인하고, Vercel 빌드가 성공했는지 확인하세요."
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 120) || "서버 응답을 처리하지 못했습니다.");
  }
}
