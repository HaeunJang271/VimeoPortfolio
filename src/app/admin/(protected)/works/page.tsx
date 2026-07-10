import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { WorksOrderManager } from "@/components/WorksOrderManager";
import { getDirectors } from "@/services/directors";
import { getWorks } from "@/services/works";

export default async function AdminWorksPage() {
  const works = await getWorks();
  const directors = await getDirectors();
  const directorNamesById = Object.fromEntries(
    directors.map((director) => [director.id, director.name])
  );

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-white">Works</h1>
            <p className="mt-2 text-sm text-white/40">
              {works.length} project{works.length !== 1 ? "s" : ""} · 순서는
              아래에서 드래그로 변경
            </p>
          </div>
          <Link
            href="/admin/works/new"
            className="flex items-center gap-2 bg-white px-5 py-2.5 text-sm font-medium tracking-[0.05em] text-black transition-opacity hover:opacity-80"
          >
            <Plus size={16} />
            New Work
          </Link>
        </div>

        {works.length === 0 ? (
          <div className="border border-white/10 p-12 text-center">
            <p className="text-sm text-white/40">No works yet.</p>
            <Link
              href="/admin/works/new"
              className="mt-4 inline-block text-sm text-white underline underline-offset-4"
            >
              Create your first work
            </Link>
          </div>
        ) : (
          <WorksOrderManager works={works} directorNamesById={directorNamesById} />
        )}
      </main>
    </div>
  );
}
