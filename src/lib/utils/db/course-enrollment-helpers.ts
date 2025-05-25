import { db } from "@/db/index";
import { courseSession, roster } from "@/db/schema";
import { and, count, eq } from "drizzle-orm";

export async function countEnrolled(courseSessionId: string): Promise<number> {
  const allotmentCount = await db
    .select({ count: count() })
    .from(roster)
    .where(eq(roster.courseSessionId, courseSessionId));
  return allotmentCount[0].count;
}

export async function getStudentAllotment(
  courseSessionId: string
): Promise<number> {
  const allotmentCount = await db
    .select({ studentAllotment: courseSession.studentAllotment })
    .from(courseSession)
    .where(eq(courseSession.id, courseSessionId));
  return allotmentCount[0].studentAllotment || 0;
}

export async function isMaxAllotment(
  courseSessionId: string
): Promise<boolean> {
  const currentStudentCount = await countEnrolled(courseSessionId);
  const studentAllotment = await getStudentAllotment(courseSessionId);
  return currentStudentCount >= studentAllotment;
}

export async function isStudentEnrolled({
  courseSessionId,
  studentId,
}: {
  courseSessionId: string;
  studentId: string;
}): Promise<boolean> {
  const foundEnrollment = await db.query.roster.findFirst({
    where: and(
      eq(roster.studentId, studentId),
      eq(roster.courseSessionId, courseSessionId)
    ),
  });
  return Boolean(foundEnrollment);
}
