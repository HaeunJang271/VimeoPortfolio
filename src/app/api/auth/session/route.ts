import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/firebase/admin-users";
import {
  getAdminAuth,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_IN,
} from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const hasAdminRole = await isAdmin(decoded.uid, decoded.email);

    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRES_IN / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create session";
    const status = message.includes("credentials") || message.includes("service account")
      ? 500
      : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
