"use client";
import { CoursesSessionsCreateForm } from "@/components/courses-sessions/courses-sessions-create/CoursesSessionsCreateForm";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useSession } from "next-auth/react";

export default function NewClassSessionPage() {
  const { status } = useSession();
  const { isAdminAuthorized } = useAdminAuthorized();

  if (status === "unauthenticated") {
    return <div>Unauthorized</div>;
  }

  if (isAdminAuthorized) {
    return <CoursesSessionsCreateForm />;
  }
  return <div>Unauthorized</div>;
}
