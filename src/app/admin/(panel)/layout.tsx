import { Sidebar } from "@/components/admin/sidebar";
import { SetupNotice } from "@/components/admin/setup-notice";
import { requireAdmin } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";

export const instant = false;

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="mx-auto flex min-h-dvh max-w-[1400px] flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">
        {hasDatabase ? children : <SetupNotice />}
      </main>
    </div>
  );
}
