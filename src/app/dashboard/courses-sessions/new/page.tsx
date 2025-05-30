"use client";
import { CoursesSessionsCreateForm } from "@/components/courses-sessions/courses-sessions-create/CoursesSessionsCreateForm";
import { useSession } from "next-auth/react";

export default function NewClassSessionPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <div>Unauthorized</div>;
  }

  if (session?.user?.role === "teacher" || session?.user?.role === "admin") {
    return <CoursesSessionsCreateForm />;
  }
  return <div>Unauthorized</div>;
}
