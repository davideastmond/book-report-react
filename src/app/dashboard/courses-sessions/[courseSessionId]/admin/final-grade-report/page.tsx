"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { ClassListFinalGradeTable } from "@/components/class-list-final-grade-table/Class-list-final-grade-table";

import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
import { useAdminAuthorized } from "app/hooks/use-admin-authorized";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseSessionFinalReportPage() {
  const [finalGradeReport, setFinalGradeReport] = useState<{
    report: SummarizedData[];
    courseData: {
      courseName?: string | null;
      courseCode?: string | null;
      sessionStart?: string | null;
      sessionEnd?: string | null;
      courseSessionId?: string | null;
    };
  } | null>(null);

  const params = useParams<{ courseSessionId: string }>();
  const { isAdminAuthorized } = useAdminAuthorized();
  useEffect(() => {
    if (!isAdminAuthorized) return;
    fetchFinalGradeReport();
  }, [isAdminAuthorized]);

  const fetchFinalGradeReport = async () => {
    const data = await CourseSessionClient.getFinalGradeReport(
      params.courseSessionId
    );
    setFinalGradeReport(data);
  };

  if (!isAdminAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <>
      {!finalGradeReport || finalGradeReport.report.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg">No final grade report available.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">Final Grade Report</h1>
          <h2 className="text-lg font-semibold">
            {finalGradeReport?.courseData.courseName} (
            {finalGradeReport?.courseData.courseCode})
          </h2>
          <h2>
            {finalGradeReport.courseData.sessionStart &&
              new Date(
                finalGradeReport.courseData.sessionStart
              ).toLocaleDateString()}{" "}
            -
            {finalGradeReport.courseData.sessionEnd &&
              new Date(
                finalGradeReport.courseData.sessionEnd
              ).toLocaleDateString()}
          </h2>
          {finalGradeReport && (
            <ClassListFinalGradeTable data={finalGradeReport.report} />
          )}
        </div>
      )}
    </>
  );
}
