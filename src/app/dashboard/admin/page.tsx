import { authOptions } from "@/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function AdminDashboardPage() {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession || !serverSession.user) {
    redirect("/login");
  }
  return (
    <div>
      <h1 className="text-3xl">Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage users, courses, and
        more.
      </p>
    </div>
  );
}
