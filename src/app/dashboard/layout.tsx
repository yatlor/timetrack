import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 p-8 bg-[var(--secondary)]">{children}</main>
    </div>
  );
}
