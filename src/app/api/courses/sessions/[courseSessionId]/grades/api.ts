"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { AcademicGrade, academicGrade } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import {
  GradeData,
  StudentGradeData,
  TableData,
} from "@/lib/types/grading/student/definitions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function apiGetGradesForCourseSession(
  courseSessionId: string
): Promise<ApiResult<AcademicGrade[]>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const gradeResults = await db.query.academicGrade.findMany({
      where: eq(academicGrade.courseSessionId, courseSessionId),
    });
    return {
      success: true,
      data: gradeResults,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching grades: " + (error as Error).message,
    };
  }
}

export async function apiSubmitGradeUpdatesForCourseSession(
  courseSessionId: string,
  data: TableData
): Promise<ApiResult<null>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    // Validate data structure here if necessary
    const taskedPromises: Promise<void>[] = [];
    Object.entries(data).forEach(([academicTaskId, studentGradeData]) => {
      taskedPromises.push(
        updateGradeByTask({
          courseSessionId,
          academicTaskId,
          studentGradeData: studentGradeData as StudentGradeData,
        })
      );
    });
    await Promise.all(taskedPromises);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Error submitting grade updates: " + (error as Error).message,
    };
  }
}

async function updateGradeByTask({
  courseSessionId,
  academicTaskId,
  studentGradeData,
}: {
  courseSessionId: string;
  academicTaskId: string;
  studentGradeData: StudentGradeData;
}) {
  /*
   */

  for await (const [studentId, gradeData] of Object.entries(studentGradeData)) {
    console.log(
      "Processing student:",
      studentId,
      "with grade data:",
      gradeData
    );
    const existingGrade = await db.query.academicGrade.findFirst({
      where: and(
        eq(academicGrade.courseSessionId, courseSessionId),
        eq(academicGrade.academicTaskId, academicTaskId),
        eq(academicGrade.userId, studentId)
      ),
    });

    if (existingGrade) {
      console.log("Updating existing grade for student:", studentId);
      await updateStudentGrade(studentId, gradeDataFilter(gradeData));
    } else {
      console.log("Inserting new grade for student:", studentId);
      await insertStudentGrade(studentId, gradeDataFilter(gradeData));
    }
  }

  function gradeDataFilter(data: GradeData): GradeData {
    return {
      percentageGrade:
        data.percentageGrade?.toString() === "" ? null : data.percentageGrade,
      letterGrade: data.letterGrade ?? null,
      instructorFeedback: data.instructorFeedback ?? null,
    };
  }
  async function insertStudentGrade(
    studentId: string,
    gradeData: {
      percentageGrade?: number | null;
      letterGrade?: string | null;
      instructorFeedback?: string | null;
    }
  ) {
    await db.insert(academicGrade).values({
      id: crypto.randomUUID(),
      courseSessionId,
      academicTaskId,
      userId: studentId,
      ...(gradeData as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */,
    });
  }

  async function updateStudentGrade(
    studentId: string,
    gradeData: {
      percentageGrade?: number | null;
      letterGrade?: string | null;
      instructorFeedback?: string | null;
    }
  ) {
    await db
      .update(academicGrade)
      .set(gradeData as object)
      .where(
        and(
          eq(academicGrade.courseSessionId, courseSessionId),
          eq(academicGrade.academicTaskId, academicTaskId),
          eq(academicGrade.userId, studentId)
        )
      );
  }
}
