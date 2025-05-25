"use client";
import { ClassesSessionsCreateForm } from "@/components/classes-sessions/classes-sessions-create/ClassesSessionsCreateForm";
import { useSession } from "next-auth/react";

export default function NewClassSessionPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <div>Unauthorized</div>;
  }

  if (session?.user?.role === "teacher" || session?.user?.role === "admin") {
    return <ClassesSessionsCreateForm />;
  }
  return <div>Unauthorized</div>;
}
