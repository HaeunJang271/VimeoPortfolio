import { AdminSidebar } from "@/components/AdminSidebar";
import { SiteSettingsForm } from "@/components/SiteSettingsForm";
import { getSiteSettings } from "@/services/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white">Settings</h1>
          <p className="mt-2 text-sm text-white/40">
            Manage showreel, contact details, and logo
          </p>
        </div>
        <div className="max-w-2xl">
          <SiteSettingsForm settings={settings} />
        </div>
      </main>
    </div>
  );
}
