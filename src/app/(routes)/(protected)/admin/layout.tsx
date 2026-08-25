import DashboardSidebar from "@/components/DashboardSidebar";
import { getServerSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";



// AdminLayout
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col xl:flex-row mx-auto">
      <DashboardSidebar />
      <main className="flex-1 p-6 xl:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
