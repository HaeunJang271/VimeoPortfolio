import { Suspense } from "react";
import { getFirebaseConfigFromEnv } from "@/lib/firebase/server-config";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const firebaseConfig = getFirebaseConfigFromEnv();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      {firebaseConfig ? (
        <Suspense>
          <LoginForm firebaseConfig={firebaseConfig} />
        </Suspense>
      ) : (
        <div className="max-w-md rounded-sm border border-red-500/30 bg-red-500/10 px-6 py-5 text-center text-sm text-red-400">
          Firebase 설정이 서버에 없습니다.
          <br />
          Vercel Environment Variables에 NEXT_PUBLIC_FIREBASE_* 6개를 등록한 뒤
          재배포하세요.
        </div>
      )}
    </div>
  );
}
