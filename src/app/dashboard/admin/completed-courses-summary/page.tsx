"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { GroupedCourseTable } from "@/components/grouped-course-table/Grouped-course-table";
import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CompletedCoursesSummaryPage() {
  const [groupedCourses, setGroupedCourses] = useState<GroupedCourseInfo[]>([]);
  const { status } = useSession();
  const { isAdminAuthorized } = useAdminAuthorized();

  useEffect(() => {
    if (isAdminAuthorized) {
      loadGroupedCourseInfo();
    }
  }, [isAdminAuthorized]);

  async function loadGroupedCourseInfo() {
    if (status === "unauthenticated") return;
    const data = await CourseSessionClient.fetchGroupedCourseSessionByCourse();
    setGroupedCourses(data);
  }

  if (status === "unauthenticated") {
    return <h1 className="text-4xl">Not authorized</h1>;
  }

  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }
  return (
    <>
      <GroupedCourseTable groupedCourses={groupedCourses} />
    </>
  );
}
