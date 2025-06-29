"use client";
import { CoursesSessionsMain } from "@/components/courses-sessions/Courses-sessions-main";
import { CourseSessionsNavToolbar } from "@/components/nav/student/Course-sessions-nav-toolbar";
import { Spinner } from "@/components/spinner/Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
/**
 * This page deals with courses session. Teachers should show all of the courses they've created
 * Admins should see all of the courses created by teachers
 * Students should see all of the courses they are enrolled in
 *
 * Admins and teachers should be able to create new courses
 */
export default function CoursesSessionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdmin = useMemo(() => {
    return ["admin", "teacher"].includes(session?.user?.role as string);
  }, [session?.user]);

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  if (!session?.user) return <Spinner />;
  return (
    <>
      <CourseSessionsNavToolbar isAdmin={isAdmin} />
      <CoursesSessionsMain isAdmin={isAdmin} />
    </>
  );
}
