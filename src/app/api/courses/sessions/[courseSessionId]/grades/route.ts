import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { academicGrade } from "@/db/schema";
import {
  GradeData,
  StudentGradeData,
  TableData,
} from "@/lib/types/grading/student/definitions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const { courseSessionId } = await urlData.params;
  try {
    const gradeResults = await db.query.academicGrade.findMany({
      where: eq(academicGrade.courseSessionId, courseSessionId),
    });
    return NextResponse.json(gradeResults);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching grades: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const { courseSessionId } = await urlData.params;
  try {
    const data = (await req.json()) as TableData;
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
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error updating grades: " + (error as Error).message,
      },
      { status: 500 }
    );
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
