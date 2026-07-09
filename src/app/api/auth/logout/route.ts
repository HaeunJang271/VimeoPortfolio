import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAdminAuth,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase/admin";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (session) {
      const decoded = await getAdminAuth().verifySessionCookie(session);
      await getAdminAuth().revokeRefreshTokens(decoded.sub);
    }
  } catch {
    // Session may already be invalid
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
