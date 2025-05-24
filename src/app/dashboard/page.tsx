"use client";
import { AdminDashboard } from "@/components/dashboards/admin/Admin-dashboard";
import { StudentDashboard } from "@/components/dashboards/student/Student-dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    return router.replace("/login");
  }

  if (session?.user) {
    switch (session.user.role) {
      case "student":
        return <StudentDashboard />;

      case "admin":
      case "teacher":
        return <AdminDashboard />;
    }
  }
}
