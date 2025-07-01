import { authOptions } from "@/auth/auth";
import { calculateGPA } from "@/lib/controller/grades/calculations/gpa-calculator";
import { StudentGradeCalculator } from "@/lib/controller/grades/calculations/student-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { GradeSummaryData } from "@/lib/types/grading/student/definitions";
import { validateGradesAPIRequest } from "@/lib/validators/grades/grades-request-validator";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/* 
Example endpoint
/api/user/grades?studentId=123&filter=courseSession&startDate=2023-01-01&endDate=2023-12-31
*/
export async function GET(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized - no user session found",
      },
      { status: 401 }
    );
  }

  const query = req.nextUrl.searchParams;

  try {
    validateGradesAPIRequest(query);
  } catch (error) {
    return NextResponse.json({
      error: "Invalid query parameters:" + (error as Error).message,
    });
  }

  const startDate = query.get("startDate");
  const endDate = query.get("endDate");
  const studentId = query.get("studentId");

  try {
    // Create the raw report data
    const rawReportData = await GradeController.getRawGradeReportData({
      studentId: studentId!,
      startDate: new Date(startDate!),
      endDate: new Date(endDate || new Date().toISOString()),
    });

    // Based on the raw data, determine the weighted grade
    const finalGradesByCourseSessionId = new StudentGradeCalculator(
      rawReportData
    ).calculate();

    const apiResponse: GradeSummaryData[] = [];

    // Collate the data for an API Response
    for (const [k, v] of Object.entries(finalGradesByCourseSessionId)) {
      const foundData = rawReportData.find((d) => d.courseSessionId === k);
      if (!foundData) throw Error("When referencing data, it wasn't found");
      apiResponse.push({
        studentFirstName: foundData.studentFirstName,
        studentLastName: foundData.studentLastName,
        studentId: foundData.studentId,
        courseName: foundData.courseName,
        courseCode: foundData.courseCode,
        coursePercentageAverage: v,
        isCourseCompleted: foundData.isCourseCompleted,
        sessionStart: foundData.sessionStart,
        sessionEnd: foundData.sessionEnd,
        instructorFirstName: foundData.instructorFirstName,
        instructorLastName: foundData.instructorLastName,
      });
    }

    const gpa = calculateGPA(finalGradesByCourseSessionId)?.toFixed(1);
    return NextResponse.json({ data: apiResponse, gpa: gpa });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Grades computation error: " + (error as Error).message,
      },
      { status: 400 }
    );
  }
}
