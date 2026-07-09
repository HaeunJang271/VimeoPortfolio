import { AdminSidebar } from "@/components/AdminSidebar";
import { ProjectForm } from "@/components/ProjectForm";
import { getDirectors } from "@/services/directors";

interface NewWorkPageProps {
  searchParams: Promise<{ directorId?: string }>;
}

export default async function NewWorkPage({ searchParams }: NewWorkPageProps) {
  const { directorId } = await searchParams;
  const directors = await getDirectors();
  const returnTo = directorId
    ? `/admin/directors/${directorId}/edit`
    : undefined;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white">New Work</h1>
          <p className="mt-2 text-sm text-white/40">Add a new project</p>
        </div>
        <div className="max-w-2xl">
          <ProjectForm
            mode="create"
            directors={directors}
            initialDirectorIds={directorId ? [directorId] : []}
            returnTo={returnTo}
          />
        </div>
      </main>
    </div>
  );
}
