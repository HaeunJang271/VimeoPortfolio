import Link from "next/link";
import { Film, Plus, Users } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { getDirectors } from "@/services/directors";
import { getSiteSettings } from "@/services/settings";
import { getWorks } from "@/services/works";

export default async function AdminDashboardPage() {
  const works = await getWorks();
  const directors = await getDirectors();
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-white/40">
            Manage your portfolio content
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            icon={<Film size={20} />}
            label="Total Works"
            value={works.length.toString()}
          />
          <StatCard
            icon={<Users size={20} />}
            label="Total Directors"
            value={directors.length.toString()}
          />
          <StatCard
            icon={<Film size={20} />}
            label="Showreel"
            value={settings.homepageShowreel ? "Connected" : "Missing"}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/works/new"
            className="flex items-center justify-between border border-white/10 p-6 transition-colors hover:border-white/30"
          >
            <div>
              <p className="text-xs tracking-[0.15em] text-white/40">
                QUICK ACTION
              </p>
              <p className="mt-2 text-sm text-white">Add New Work</p>
            </div>
            <Plus size={20} className="text-white/40" />
          </Link>
          <Link
            href="/admin/directors/new"
            className="flex items-center justify-between border border-white/10 p-6 transition-colors hover:border-white/30"
          >
            <div>
              <p className="text-xs tracking-[0.15em] text-white/40">
                QUICK ACTION
              </p>
              <p className="mt-2 text-sm text-white">Add New Director</p>
            </div>
            <Plus size={20} className="text-white/40" />
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center justify-between border border-white/10 p-6 transition-colors hover:border-white/30"
          >
            <div>
              <p className="text-xs tracking-[0.15em] text-white/40">
                QUICK ACTION
              </p>
              <p className="mt-2 text-sm text-white">Update Site Settings</p>
            </div>
            <Plus size={20} className="text-white/40" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 p-6">
      <div className="flex items-center gap-3 text-white/40">
        {icon}
        <p className="text-xs tracking-[0.15em]">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-medium text-white">{value}</p>
    </div>
  );
}
