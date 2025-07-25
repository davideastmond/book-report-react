"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { ClassListFinalGradeTable } from "@/components/class-list-final-grade-table/Class-list-final-grade-table";
import { CoursesSessionsList } from "@/components/courses-sessions/courses-sessions-list/Courses-sessions-list";

import { Spinner } from "@/components/spinner/Spinner";
import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

  const { isAdminAuthorized } = useAdminAuthorized();

  useEffect(() => {
    if (!isAdminAuthorized) return;
    fetchCourseSession();
    fetchCourseSessionGradeAverage();
    getFinalGradeReport();
  }, [isAdminAuthorized]);

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
    setFinalGradeReport(data.report);
  }

  const convertedChartData = useMemo<AgChartOptions>(() => {
    if (!finalGradeReport)
      return {
        data: [],
        series: [],
      };

    const data = finalGradeReport.map((item) => ({
      studentName: `${item.studentLastName} ${item.studentLastName.slice(
        0,
        1
      )}.`,
      finalGrade: item.finalGrade,
    }));

    return {
      data,
      theme: "ag-material-dark",
      series: [
        {
          type: "bar" as const,
          xKey: "studentName",
          yKey: "finalGrade",
          yName: "Final Grade",
          xName: "Student First Name",
        },
      ],
    };
  }, [finalGradeReport]);

  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }
  if (courseSession === null) {
    return <Spinner />;
  }
  return (
    <>
      <div className="mt-12">
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
          <ClassListFinalGradeTable data={finalGradeReport} />
        </div>
        <div className="mt-10 mx-4">
          <AgCharts options={convertedChartData} />
        </div>
      </div>
    </>
  );
}
