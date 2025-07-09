// This renders the tools that permits admins and teachers to add/delete/define course work for a specific course
"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { CourseWorkList } from "@/components/course-work-list/Course-work-list";
import { CoursesSessionsList } from "@/components/courses-sessions/courses-sessions-list/Courses-sessions-list";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { Spinner } from "@/components/spinner/Spinner";
import { AcademicTaskWithWeighting } from "@/lib/types/course-work/definitions";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

/* 
- Keep in mind that exams, quizzes, and assignments (any thing that can be graded or to which feedback can be give) are all considered course work
- This page is only accessible to admins and teachers
 - Show the classlist table for this one course session as a header
 - Show a current course work table for this one course session with relevant stats
 - show a widget to add new course work
*/
export default function AdminCourseWorkPage() {
  const [courseSession, setCourseSession] = useState<CourseSessionInfo | null>(
    null
  );
  const [courseWork, setCourseWork] = useState<AcademicTaskWithWeighting[]>([]); // Adjust type as needed

  const router = useRouter();
  const { data: session, status } = useSession();
  const params = useParams<{ courseSessionId: string }>();
  const { isAdminAuthorized } = useAdminAuthorized();

  useEffect(() => {
    if (!isAdminAuthorized) return;
    fetchCourseSession();
    fetchCourseWorkForSession();
  }, [isAdminAuthorized]);

  const fetchCourseSession = async () => {
    try {
      const res = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        params.courseSessionId
      );

      setCourseSession(res.courseSessionData);
    } catch (error) {
      console.error("Error fetching course session data:", error);
    }
  };

  const fetchCourseWorkForSession = async () => {
    try {
      const res = await CourseWorkClient.getCourseWorkForSession(
        params.courseSessionId
      );
      setCourseWork(res);
    } catch (error) {
      console.error("Error fetching course work for session:", error);
    }
  };

  if (status === "unauthenticated") {
    return router.replace("/login");
  }

  if (!["admin", "teacher"].includes(session?.user?.role as string)) {
    return (
      <>
        <p className="text-red-500 text-center">Verifying...</p>
        <Spinner />
      </>
    );
  }

  if (!courseSession) {
    return <Spinner />;
  }

  return (
    <div>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
      <h1 className="text-3xl py-4">Course Work Manager(Admin)</h1>
      <CoursesSessionsList coursesSessions={[courseSession]} />
      {courseSession.isCompleted && (
        <p className="text-amber-300 my-4">This course session is completed.</p>
      )}
      <h2 className="text-2xl py-4">Tasks for this course</h2>
      <CourseWorkList courseWork={courseWork} linkable />
      {!courseSession.isCompleted && (
        <div className="flex justify-end mx-4 mt-4">
          <Link
            className="flatStyle"
            href={`/dashboard/courses-sessions/${params.courseSessionId}/admin/course-work/new`}
          >
            New Course Work...
          </Link>
        </div>
      )}
    </div>
  );
}
