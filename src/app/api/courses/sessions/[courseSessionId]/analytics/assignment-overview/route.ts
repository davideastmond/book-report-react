import { authOptions } from "@/auth/auth";
import { aggregateCourseAssignmentData } from "@/lib/controller/grades/aggregators/course-assignment-aggregator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/* 
In this route, we want to gather all the assignments for a course session
*/
export async function GET(
  _: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized access",
      },
      { status: 401 }
    );
  }

  if (!["teacher", "admin"].includes(authSession.user.role)) {
    return NextResponse.json(
      { error: "You do not have permission to access this resource" },
      { status: 403 }
    );
  }

  const { courseSessionId } = await urlData.params;

  if (!courseSessionId) {
    return NextResponse.json(
      { error: "Course session ID is required" },
      { status: 400 }
    );
  }

  const rawGradesData = await GradeController.getRawDataForCourseSessionById(
    courseSessionId
  );
  const aggregatedData = aggregateCourseAssignmentData(rawGradesData);
  return NextResponse.json(aggregatedData, { status: 200 });
}
