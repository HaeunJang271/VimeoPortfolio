"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { LayoutDashboard, Film, LogOut, Users, Settings } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase/client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/directors", label: "Directors", icon: Users },
  { href: "/admin/works", label: "Works", icon: Film },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(getFirebaseAuth());
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-black">
      <div className="border-b border-white/10 px-6 py-8">
        <p className="text-xs tracking-[0.2em] text-white/40">ADMIN</p>
        <p className="mt-1 text-sm font-medium text-white">Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}
