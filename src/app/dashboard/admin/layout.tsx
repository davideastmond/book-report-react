import { AdminOptionsToolbar } from "@/components/nav/admin/admin-options-toolbar/Admin-options-toolbar";

export default function AdminOptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminOptionsToolbar />
      {children}
    </div>
  );
}
