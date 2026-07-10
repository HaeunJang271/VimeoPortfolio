import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { DirectorsOrderManager } from "@/components/DirectorsOrderManager";
import { getDirectors } from "@/services/directors";

export default async function AdminDirectorsPage() {
  const directors = await getDirectors();

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-white">Directors</h1>
            <p className="mt-2 text-sm text-white/40">
              {directors.length} director{directors.length !== 1 ? "s" : ""} ·
              순서는 아래에서 드래그로 변경
            </p>
          </div>
          <Link
            href="/admin/directors/new"
            className="flex items-center gap-2 bg-white px-5 py-2.5 text-sm font-medium tracking-[0.05em] text-black transition-opacity hover:opacity-80"
          >
            <Plus size={16} />
            New Director
          </Link>
        </div>

        {directors.length === 0 ? (
          <div className="border border-white/10 p-12 text-center">
            <p className="text-sm text-white/40">No directors yet.</p>
          </div>
        ) : (
          <DirectorsOrderManager directors={directors} />
        )}
      </main>
    </div>
  );
}
