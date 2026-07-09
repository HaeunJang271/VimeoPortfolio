import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ProjectForm } from "@/components/ProjectForm";
import { getDirectors } from "@/services/directors";
import { getWorkById } from "@/services/works";

interface EditWorkPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const { id } = await params;
  const work = await getWorkById(id);
  const directors = await getDirectors();

  if (!work) notFound();

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white">Edit Work</h1>
          <p className="mt-2 text-sm text-white/40">{work.title}</p>
        </div>
        <div className="max-w-2xl">
          <ProjectForm mode="edit" work={work} directors={directors} />
        </div>
      </main>
    </div>
  );
}
