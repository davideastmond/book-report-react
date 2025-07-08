// This page shows a single course session by its id
"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { CoursesSessionsList } from "@/components/courses-sessions/courses-sessions-list/Courses-sessions-list";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { Spinner } from "@/components/spinner/Spinner";
import { StudentList } from "@/components/student-list/Student-list";
import { UserSearch } from "@/components/user-search/User-Search";
import {
  CourseSessionInfo,
  EnrolledStudent,
} from "@/lib/types/db/course-session-info";
import { useAdmin } from "app/hooks/use-admin";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseSessionPage() {
  const [courseSession, setCourseSession] = useState<CourseSessionInfo | null>(
    null
  );
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const { status, data: session } = useSession();
  const searchParams = useSearchParams();

  const courseSessionId = searchParams.get("id");
  const router = useRouter();

  const { isAdminEditable } = useAdmin(
    courseSession?.courseSessionId as string
  );
  useEffect(() => {
    fetchCourseSessionById();
  }, []);

  const removeStudentFromCourse = async (
    studentId: string,
    customError: string
  ) => {
    try {
      await CourseSessionClient.removeStudentFromCourseSession({
        courseSessionId: courseSessionId as string,
        studentId,
      });
      await fetchCourseSessionById();
    } catch (error) {
      if (customError) {
        setApiError(customError);
        return;
      }
      setApiError((error as Error).message);
    }
  };

  const handleStudentAddToRoster = async (
    studentId: string,
    customError?: string
  ) => {
    if (!courseSessionId) {
      console.error("No course session ID provided");
      return;
    }

    setApiError(null);
    try {
      setIsBusy(true);
      await CourseSessionClient.addStudentToCourseSession({
        courseSessionId: courseSessionId,
        studentId,
      });

      // Refresh and update
      setIsBusy(false);
      await fetchCourseSessionById();
    } catch (error) {
      if (customError) {
        setApiError(customError);
        return;
      }
      setApiError((error as Error).message);
      setIsBusy(false);
    }
  };
  async function fetchCourseSessionById() {
    if (courseSessionId) {
      setIsBusy(true);
      const res = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        courseSessionId
      );
      setCourseSession(res.courseSessionData);
      setStudents(res.students);
      setIsEnrolled(res.isEnrolled);
      setIsBusy(false);
    }
  }

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  if (!courseSession) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div>
      {["admin", "teacher"].includes(session?.user?.role as string) &&
        courseSessionId && (
          <CourseSessionsNavToolbar courseSessionId={courseSessionId} />
        )}
      <h1 className="text-3xl py-4">Session Details</h1>
      {courseSession.description && <p>{courseSession.description}</p>}
      <CoursesSessionsList
        coursesSessions={[courseSession]}
        enrolled={{ show: true, count: courseSession.allotmentCount as number }}
      />
      {courseSession.isCompleted && (
        <p className="text-amber-300 my-4">Course session completed.</p>
      )}
      {["admin", "teacher"].includes(session?.user?.role as string) && (
        <div className="mt-10">
          <h3 className="text-2xl">Student Roster</h3>
          <StudentList
            linkable
            students={students}
            disabled={courseSession.isCompleted}
          />
          <UserSearch
            onUserSelect={handleStudentAddToRoster}
            alreadyEnrolledStudents={students}
            disabled={courseSession.isCompleted || !isAdminEditable}
          />
        </div>
      )}
      {["student"].includes(session?.user?.role as string) && (
        <div className="flex justify-end px-4 mt-4">
          {!isEnrolled && !courseSession.isCompleted && (
            <button
              onClick={() =>
                handleStudentAddToRoster(
                  session?.user?.id as string,
                  "We're unable to enroll you in this course. Please contact your registrar or administrator."
                )
              }
              className="flatStyle"
              disabled={isBusy}
            >
              <span className="flex items-center gap-2">
                {isBusy && <Spinner />}
                Enroll in this course
              </span>
            </button>
          )}
          {isEnrolled && !courseSession.isCompleted && (
            <button
              onClick={() =>
                removeStudentFromCourse(
                  session?.user?.id as string,
                  "We're unable to remove you. Please contact your registrar or administrator."
                )
              }
              className="flatStyle"
              disabled={isBusy}
            >
              <span className="flex items-center gap-2">
                {isBusy && <Spinner />}I am enrolled in this course. Click to
                un-enroll.
              </span>
            </button>
          )}
        </div>
      )}
      {apiError && <div className="text-red-500 text-sm mt-2">{apiError}</div>}
    </div>
  );
}
