import { Suspense } from "react";
import {
  getFirebaseConfigFromEnv,
  getMissingFirebaseClientEnvKeys,
} from "@/lib/firebase/server-config";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const firebaseConfig = getFirebaseConfigFromEnv();
  const missingKeys = getMissingFirebaseClientEnvKeys();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      {firebaseConfig ? (
        <Suspense>
          <LoginForm />
        </Suspense>
      ) : (
        <div className="max-w-md rounded-sm border border-red-500/30 bg-red-500/10 px-6 py-5 text-center text-sm text-red-400">
          <p>Firebase 클라이언트 설정이 서버에 없습니다.</p>
          <p className="mt-3 text-left text-xs leading-6 text-red-300/90">
            Vercel → Settings → Environment Variables 에 아래 값을
            등록하고 재배포하세요.
            <br />
            (Production / Preview / Development 모두 체크)
          </p>
          {missingKeys.length > 0 ? (
            <ul className="mt-3 list-inside list-disc text-left text-xs text-red-300/80">
              {missingKeys.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 text-left text-xs text-red-300/80">
            로컬 `.env.local`의 NEXT_PUBLIC_FIREBASE_* 6개를 그대로
            복사하면 됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
