import { authOptions } from "@/auth/auth";
import { GradeController } from "@/lib/controller/grades/grade-controller";
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

  const result = await GradeController.getGradeSummaryByDate({
    studentId: query.get("studentId") as string,
    startDate: new Date(query.get("startDate")!),
    endDate: new Date(query.get("endDate") || new Date().toISOString()),
  });
  return NextResponse.json(result);
}
