"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { CoursesSessionsList } from "@/components/courses-sessions-list/courses-sessions-list/Courses-sessions-list";
import { Spinner } from "@/components/spinner/Spinner";
import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
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

  const [finalGradeReport, setFinalGradeReport] = useState<
    SummarizedData[] | null
  >(null);

  useEffect(() => {
    fetchCourseSession();
    fetchCourseSessionGradeAverage();
    getFinalGradeReport();
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

  async function getFinalGradeReport() {
    const data = await CourseSessionClient.getFinalGradeReport(
      params.courseSessionId
    );
    setFinalGradeReport(data);
  }

  if (courseSession === null) {
    return <Spinner />;
  }
  return (
    <div className="mt-10">
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
      <div className="mt-10">
        <h2 className="text-2xl">Final Grade Report</h2>
        {/* Table For the finale grade report */}
        <table className="table-auto w-full mt-4">
          <thead className="text-left">
            <tr>
              <th>Student First N.</th>
              <th>Student Last N.</th>
              <th>Final Grade</th>
            </tr>
          </thead>
          <tbody>
            {finalGradeReport ? (
              finalGradeReport.map((data, index) => (
                <tr
                  key={data.studentId}
                  className={`${
                    index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
                  }`}
                >
                  <td>{data.studentFirstName}</td>
                  <td>{data.studentLastName}</td>
                  <td>{data.finalGrade.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
