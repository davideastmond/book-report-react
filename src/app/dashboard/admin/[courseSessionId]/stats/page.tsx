"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CoursesSessionsList } from "@/components/courses-sessions-list/courses-sessions-list/Courses-sessions-list";
import { Spinner } from "@/components/spinner/Spinner";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* 
On this page we will display the basic stats for a course session.
Display the course average

*/
export default function CourseSessionStatsPage() {
  const [courseSession, setCourseSession] = useState<CourseSessionInfo | null>(
    null
  );

  const [sessionGradeAverage, setSessionGradeAverage] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchCourseSession();
    fetchCourseSessionGradeAverage();
  }, []);
  const params = useParams<{ courseSessionId: string }>();

  async function fetchCourseSession() {
    const data = await CourseSessionClient.fetchCourseSessionByIdAdmin(
      params.courseSessionId
    );
    setCourseSession(data.courseSessionData);
  }

  async function fetchCourseSessionGradeAverage() {
    const data = await CourseSessionClient.getCourseGradeAverage(
      params.courseSessionId
    );
    setSessionGradeAverage(data.courseSessionGradeAverage);
  }

  if (courseSession === null) {
    return <Spinner />;
  }
  return (
    <div>
      <CoursesSessionsList coursesSessions={[courseSession]} />
      <div className="mt-10">
        <table className="table-fixed">
          <thead>
            <tr>
              <th>Course Session Grade Avg.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {sessionGradeAverage !== null ? sessionGradeAverage : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
