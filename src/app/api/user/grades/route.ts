import { authOptions } from "@/auth/auth";
import { GradeCalculator } from "@/lib/controller/grades/calculations/grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { GradeSummaryData } from "@/lib/types/grading/definitions";
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

  const rawReportData = await GradeController.getRawGradeReportData({
    studentId: query.get("studentId") as string,
    startDate: new Date(query.get("startDate")!),
    endDate: new Date(query.get("endDate") || new Date().toISOString()),
  });

  const finalGradesByCourseSessionId = new GradeCalculator(
    rawReportData
  ).calculate();

  const apiResponse: GradeSummaryData[] = [];
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

  return NextResponse.json(apiResponse);
}
