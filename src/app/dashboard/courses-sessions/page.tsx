"use client";
import { CoursesSessionsMain } from "@/components/courses-sessions/Courses-sessions-main";

import { Spinner } from "@/components/spinner/Spinner";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
/**
 * This page deals with courses session. Teachers should show all of the courses they've created
 * Admins should see all of the courses created by teachers
 * Students should see all of the courses they are enrolled in
 *
 * Admins and teachers should be able to create new courses
 */
export default function CoursesSessionsPage() {
  const router = useRouter();
  const { status } = useSession();

  const { isAdminAuthorized } = useAdminAuthorized();

  if (isAdminAuthorized === null) {
    return <Spinner />;
  }
  if (status === "unauthenticated") {
    router.replace("/login");
  }
  return <CoursesSessionsMain isAdmin={isAdminAuthorized} />;
}
