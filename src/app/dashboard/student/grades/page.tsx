"use client";
import { GradesOverviewComponent } from "@/components/grade-components/Grades-overview";
import { useSession } from "next-auth/react";

export default function StudentGradesPage() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return <div>Unauthorized</div>;
  }
  return (
    <div>
      <GradesOverviewComponent />
    </div>
  );
}
