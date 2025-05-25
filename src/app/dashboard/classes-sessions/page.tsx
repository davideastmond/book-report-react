"use client";
import { ClassesSessionsMain } from "@/components/classes-sessions/Classes-sessions-main";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
/**
 * This page deals with classes session. Teachers should show all of the classes they've created
 * Admins should see all of the classes created by teachers
 * Students should see all of the classes they are enrolled in
 *
 * Admins and teachers should be able to create new classes
 */
export default function ClassesSessionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.replace("/login");
  }
  return (
    <>
      <ClassesSessionsMain
        isAdmin={["admin", "teacher"].includes(session?.user?.role as string)}
      />
    </>
  );
}
