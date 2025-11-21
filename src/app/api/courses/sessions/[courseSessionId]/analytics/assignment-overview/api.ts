"use server";
import { authOptions } from "@/auth/auth";
import { aggregateCourseAssignmentData } from "@/lib/controller/grades/aggregators/course-assignment-aggregator";
import { AggregatedCourseAssignmentData } from "@/lib/controller/grades/aggregators/definitions";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { getServerSession } from "next-auth";

/* 
In this route, we want to gather all the assignments for a course session
*/
export async function apiGetAssignmentsOverview(
  courseSessionId: string
): Promise<ApiResult<AggregatedCourseAssignmentData[]>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!["teacher", "admin"].includes(authSession.user.role)) {
    return {
      success: false,
      message: "Forbidden: Insufficient permissions",
    };
  }

  const rawGradeData = await GradeController.getRawDataForCourseSessionById(
    courseSessionId
  );
  const aggregatedData = aggregateCourseAssignmentData(rawGradeData);
  return { success: true, data: aggregatedData };
}
