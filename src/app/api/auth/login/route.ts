import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/firebase/admin-users";
import {
  getAdminAuth,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_IN,
} from "@/lib/firebase/admin";
import { getFirebaseConfigFromEnv } from "@/lib/firebase/server-config";

export const dynamic = "force-dynamic";

interface FirebaseSignInResponse {
  idToken?: string;
  localId?: string;
  email?: string;
  error?: {
    message?: string;
    code?: number;
  };
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력하세요." },
        { status: 400 }
      );
    }

    const firebaseConfig = getFirebaseConfigFromEnv();
    if (!firebaseConfig?.apiKey) {
      return NextResponse.json(
        {
          error:
            "Firebase 설정이 서버에 없습니다. Vercel Environment Variables를 확인하세요.",
        },
        { status: 500 }
      );
    }

    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const signInData = (await signInRes.json()) as FirebaseSignInResponse;

    if (!signInRes.ok || !signInData.idToken) {
      const message = signInData.error?.message ?? "";

      if (message.includes("API_KEY") || message.includes("API key")) {
        return NextResponse.json(
          {
            error:
              "Firebase API Key가 올바르지 않습니다. Vercel의 NEXT_PUBLIC_FIREBASE_API_KEY 값을 Firebase Console과 동일하게 설정하세요.",
          },
          { status: 500 }
        );
      }

      if (
        message.includes("INVALID_LOGIN_CREDENTIALS") ||
        message.includes("INVALID_PASSWORD") ||
        message.includes("EMAIL_NOT_FOUND")
      ) {
        return NextResponse.json(
          { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "로그인에 실패했습니다." },
        { status: 401 }
      );
    }

    const decoded = await getAdminAuth().verifyIdToken(signInData.idToken);
    const hasAdminRole = await isAdmin(decoded.uid, decoded.email);

    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const sessionCookie = await getAdminAuth().createSessionCookie(
      signInData.idToken,
      { expiresIn: SESSION_EXPIRES_IN }
    );

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
      error instanceof Error ? error.message : "Failed to sign in";
    const status =
      message.includes("credentials") || message.includes("service account")
        ? 500
        : 401;

    return NextResponse.json({ error: message }, { status });
  }
}
