import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseSessionsAPIResponse } from "@/lib/types/db/course-session-info";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CoursesSessionsList } from "./courses-sessions-list/Courses-sessions-list";

type CoursesSessionsMainProps = {
  isAdmin?: boolean;
};
export function CoursesSessionsMain({ isAdmin }: CoursesSessionsMainProps) {
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
        <div className="mt-4 flex justify-end px-4">
          <Link href="/dashboard/courses-sessions/new" className="flatStyle">
            + New Course Session
          </Link>
        </div>
        <div className="flex justify-end p-4">
          <CoursesSessionsList coursesSessions={courseSessions} linkable />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex justify-end p-4">
        <CoursesSessionsList coursesSessions={courseSessions} linkable />
      </div>
    </>
  );
}
