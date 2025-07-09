"use client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { ClassListFinalGradeTable } from "@/components/class-list-final-grade-table/Class-list-final-grade-table";
import { CourseSessionsNavToolbar } from "@/components/nav/admin/course-sessions-nav-toolbar/Course-sessions-nav-toolbar";

import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseSessionFinalReportPage() {
  const [finalGradeReport, setFinalGradeReport] = useState<{
    report: SummarizedData[];
    courseData: { courseName: string; courseCode: string };
  } | null>(null);

  const params = useParams<{ courseSessionId: string }>();

  useEffect(() => {
    fetchFinalGradeReport();
  }, []);

  const fetchFinalGradeReport = async () => {
    const data = await CourseSessionClient.getFinalGradeReport(
      params.courseSessionId
    );
    setFinalGradeReport(data);
  };

  return (
    <>
      <CourseSessionsNavToolbar courseSessionId={params.courseSessionId} />
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
          {finalGradeReport && (
            <ClassListFinalGradeTable data={finalGradeReport.report} />
          )}
        </div>
      )}
    </>
  );
}
