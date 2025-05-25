// This page shows a single course session by its id
"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { ClassesSessionsList } from "@/components/classes-sessions/classes-sessions-list/Classes-sessions-list";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";
import { Spinner } from "@/components/spinner/Spinner";
import { StudentList } from "@/components/student-list/Student-list";
import { UserSearch } from "@/components/user-search/User-Search";
import {
  CourseSessionInfo,
  EnrolledStudent,
} from "@/lib/types/db/course-session-info";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseSessionPage() {
  const [courseSession, setCourseSession] = useState<CourseSessionInfo | null>(
    null
  );
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const courseSessionId = searchParams.get("id");
  useEffect(() => {
    fetchCourseSessionById();
  }, []);

  const removeStudentFromCourse = async (
    studentId: string,
    customError: string
  ) => {
    console.error("Not implemented yet", studentId, customError);
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
      await CourseSessionClient.addStudentToCourseSession({
        courseSessionId: courseSessionId,
        studentId,
      });

      // Refresh and update
      await fetchCourseSessionById();
    } catch (error) {
      if (customError) {
        setApiError(customError);
        return;
      }
      setApiError((error as Error).message);
    }
  };
  async function fetchCourseSessionById() {
    if (courseSessionId) {
      const res = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        courseSessionId
      );
      setCourseSession(res.courseSessionData);
      setStudents(res.students);
      console.log("isENrolled", res.isEnrolled);
      setIsEnrolled(res.isEnrolled);
    }
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
      {["admin", "teacher"].includes(session?.user?.role as string) && (
        <CourseSessionsNavToolbar />
      )}
      <h1 className="text-3xl py-4">Session Details</h1>
      {courseSession.description && <p>{courseSession.description}</p>}
      <ClassesSessionsList
        classesSessions={[courseSession]}
        enrolled={{ show: true, count: courseSession.allotmentCount }}
      />
      {["admin", "teacher"].includes(session?.user?.role as string) && (
        <div className="mt-10">
          <h3 className="text-2xl">Student Roster</h3>
          <StudentList linkable students={students} />

          <UserSearch
            onUserSelect={handleStudentAddToRoster}
            alreadyEnrolledStudents={students}
          />
        </div>
      )}
      {["student"].includes(session?.user?.role as string) && (
        <div className="flex justify-end px-4">
          {!isEnrolled && (
            <button
              onClick={() =>
                handleStudentAddToRoster(
                  session?.user?.id as string,
                  "We're unable to add you. The course could be full or there was an error. Please contact your registrar or administrator."
                )
              }
              className="flatStyle"
            >
              Enroll in this course
            </button>
          )}
          {isEnrolled && (
            <button
              onClick={() =>
                removeStudentFromCourse(
                  session?.user?.id as string,
                  "We're unable to remove you. Please contact your registrar or administrator."
                )
              }
              className="flatStyle"
            >
              I am enrolled in this course. Click to remove me.
            </button>
          )}
        </div>
      )}
      {apiError && <div className="text-red-500 text-sm mt-2">{apiError}</div>}
    </div>
  );
}
