import { authOptions } from "@/auth/auth";
import { CoursesSessionsMain } from "@/components/courses-sessions/Courses-sessions-main";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
/**
 * This page deals with courses session. Teachers should show all of the courses they've created
 * Admins should see all of the courses created by teachers
 * Students should see all of the courses they are enrolled in
 *
 * Admins and teachers should be able to create new courses
 */
export default async function CoursesSessionsPage() {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession || !serverSession.user) {
    redirect("/login");
  }

  return <CoursesSessionsMain isAdmin={serverSession.user.role === "admin"} />;
}
