import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { DirectorForm } from "@/components/DirectorForm";
import { DirectorWorksManager } from "@/components/DirectorWorksManager";
import { getDirectorById, getWorksByDirectorId } from "@/services/directors";

interface EditDirectorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDirectorPage({
  params,
}: EditDirectorPageProps) {
  const { id } = await params;
  const director = await getDirectorById(id);

  if (!director) notFound();

  const works = await getWorksByDirectorId(director.id, director.workOrder);

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white">Edit Director</h1>
          <p className="mt-2 text-sm text-white/40">{director.name}</p>
        </div>
        <div className="max-w-3xl">
          <DirectorForm mode="edit" director={director} />
          <DirectorWorksManager
            directorId={director.id}
            directorName={director.name}
            works={works}
            initialWorkOrder={director.workOrder}
          />
        </div>
      </main>
    </div>
  );
}
