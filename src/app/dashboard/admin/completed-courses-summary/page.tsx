"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { GroupedCourseTable } from "@/components/grouped-course-table/Grouped-course-table";
import { AdminOptionsToolbar } from "@/components/nav/admin/admin-options-toolbar/Admin-options-toolbar";
import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CompletedCoursesSummaryPage() {
  const [groupedCourses, setGroupedCourses] = useState<GroupedCourseInfo[]>([]);
  const { status } = useSession();

  useEffect(() => {
    loadGroupedCourseInfo();
  }, []);

  async function loadGroupedCourseInfo() {
    if (status === "unauthenticated") return;
    const data = await CourseSessionClient.fetchGroupedCourseSessionByCourse();
    setGroupedCourses(data);
  }

  if (status === "unauthenticated") {
    return <h1 className="text-4xl">Not authorized</h1>;
  }
  return (
    <>
      <AdminOptionsToolbar />
      <GroupedCourseTable groupedCourses={groupedCourses} />
    </>
  );
}
