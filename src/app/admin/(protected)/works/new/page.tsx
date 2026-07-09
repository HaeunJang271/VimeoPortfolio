import { AdminSidebar } from "@/components/AdminSidebar";
import { ProjectForm } from "@/components/ProjectForm";

export default function NewWorkPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white">New Work</h1>
          <p className="mt-2 text-sm text-white/40">Add a new project</p>
        </div>
        <div className="max-w-2xl">
          <ProjectForm mode="create" />
        </div>
      </main>
    </div>
  );
}
