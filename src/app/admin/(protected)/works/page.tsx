import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { DeleteWorkButton, EditWorkLink } from "@/components/DeleteWorkButton";
import { getWorks } from "@/services/works";

export default async function AdminWorksPage() {
  const works = await getWorks();

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-white">Works</h1>
            <p className="mt-2 text-sm text-white/40">
              {works.length} project{works.length !== 1 ? "s" : ""}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    THUMBNAIL
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    TITLE
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    SLUG
                  </th>
                  <th className="pb-4 text-xs tracking-[0.15em] text-white/40">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {works.map((work) => (
                  <tr key={work.id} className="border-b border-white/5">
                    <td className="py-4">
                      <div className="relative h-12 w-20 overflow-hidden bg-white/5">
                        {work.thumbnail ? (
                          <Image
                            src={work.thumbnail}
                            alt={work.title}
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
                    <td className="py-4 text-sm text-white">{work.title}</td>
                    <td className="py-4 text-sm text-white/40">{work.slug}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <EditWorkLink workId={work.id} />
                        <DeleteWorkButton
                          workId={work.id}
                          workTitle={work.title}
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
