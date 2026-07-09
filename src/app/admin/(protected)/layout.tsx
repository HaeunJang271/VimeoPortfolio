import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/firebase/auth-server";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAdminRole = await isAdminSession();

  if (!hasAdminRole) {
    redirect("/admin/login?error=forbidden");
  }

  return children;
}
