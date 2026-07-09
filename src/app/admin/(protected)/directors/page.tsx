import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  DeleteDirectorButton,
  EditDirectorLink,
} from "@/components/DeleteDirectorButton";
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
              {directors.length} director{directors.length !== 1 ? "s" : ""}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    IMAGE
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    NAME
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    SLUG
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    ORDER
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {directors.map((director) => (
                  <tr key={director.id} className="border-b border-white/5">
                    <td className="py-4">
                      <div className="relative h-14 w-12 overflow-hidden bg-white/5">
                        {director.profileImage ? (
                          <Image
                            src={director.profileImage}
                            alt={director.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-white/20">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-white">{director.name}</td>
                    <td className="py-4 text-sm text-white/40">{director.slug}</td>
                    <td className="py-4 text-sm text-white/40">
                      {director.displayOrder}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <EditDirectorLink directorId={director.id} />
                        <DeleteDirectorButton
                          directorId={director.id}
                          directorName={director.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
