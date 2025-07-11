"use client";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";

export default function AdminDashboardPage() {
  const { isAdminAuthorized } = useAdminAuthorized();
  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl">Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage users, courses, and
        more.
      </p>
      {/* Add more admin-specific components or links here */}
    </div>
  );
}
