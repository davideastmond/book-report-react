import { AdminOptionsToolbar } from "@/components/nav/admin/admin-options-toolbar/Admin-options-toolbar";

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminOptionsToolbar />
      <h1 className="text-3xl">Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage users, courses, and
        more.
      </p>
      {/* Add more admin-specific components or links here */}
    </div>
  );
}
