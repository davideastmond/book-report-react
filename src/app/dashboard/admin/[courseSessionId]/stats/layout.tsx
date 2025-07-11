import { AdminStatsNav } from "@/components/nav/admin/stats/Admin-stats-nav";

export default function AdminStatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminStatsNav />
      {children}
    </div>
  );
}
