import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/firebase/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const hasAdminRole = await isAdminSession();

  redirect(hasAdminRole ? "/admin/dashboard" : "/admin/login");
}
