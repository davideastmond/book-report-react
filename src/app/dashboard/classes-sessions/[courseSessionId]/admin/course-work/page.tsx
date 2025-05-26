// This renders the tools that permits admins and teachers to add/delete/define course work for a specific course
"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { ClassesSessionsList } from "@/components/classes-sessions/classes-sessions-list/Classes-sessions-list";
import { Spinner } from "@/components/spinner/Spinner";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

/* 
- Keep in mind that exams, quizzes, and assignments (any thing that can be graded or to which feedback can be give) are all considered course work
- This page is only accessible to admins and teachers
 - Show the classlist table for this one course session as a header
 - Show a current course work table for this one course session with relevant stats
 - show a widget to add new course work
*/
export default function AdminCourseWorkPage({
  params,
}: {
  params: { courseSessionId: string };
}) {
  const [courseSession, setCourseSession] = useState<CourseSessionInfo | null>(
    null
  );

  const [stateCourseSessionId, setStateCourseSessionId] = useState<
    string | null
  >(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchCourseSession();
  }, []);

  const fetchCourseSession = async () => {
    const { courseSessionId } = await params;
    try {
      const res = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        courseSessionId
      );
      setStateCourseSessionId(courseSessionId);
      setCourseSession(res.courseSessionData);
    } catch (error) {
      console.error("Error fetching course session data:", error);
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
      <h1 className="text-3xl py-4">Class Work Manager(Admin)</h1>
      <ClassesSessionsList classesSessions={[courseSession]} />
      {stateCourseSessionId && (
        <div className="flex justify-end mx-4">
          <Link
            className="flatStyle"
            href={`/dashboard/classes-sessions/${stateCourseSessionId}/admin/course-work/new`}
          >
            Create
          </Link>
        </div>
      )}
    </div>
  );
}
