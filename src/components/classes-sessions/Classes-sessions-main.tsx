import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseSessionsAPIResponse } from "@/lib/types/db/course-session-info";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClassesSessionsList } from "./classes-sessions-list/Classes-sessions-list";

type ClassesSessionsMainProps = {
  isAdmin?: boolean;
};
export function ClassesSessionsMain({ isAdmin }: ClassesSessionsMainProps) {
  const [courseSessions, setCourseSessions] =
    useState<CourseSessionsAPIResponse>([]);
  useEffect(() => {
    fetchCourseSessions();
  }, [isAdmin]);

  async function fetchCourseSessions() {
    if (isAdmin) {
      const res = await CourseSessionClient.fetchCourseSessionsAdmin();
      setCourseSessions(res);
      return;
    }
    // TODO: Implement for students
    const res = await CourseSessionClient.fetchCourseSessionsByStudent();
    setCourseSessions(res);
  }

  if (isAdmin) {
    return (
      <>
        <div className="mt-4 flex justify-end">
          <Link href="/dashboard/classes-sessions/new" className="flatStyle">
            + New Class Session
          </Link>
        </div>
        <div className="flex justify-end p-4">
          <ClassesSessionsList classesSessions={courseSessions} linkable />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex justify-end p-4">
        <ClassesSessionsList classesSessions={courseSessions} linkable />
      </div>
    </>
  );
}
