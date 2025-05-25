import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { roster } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
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
  if (!courseSessionId) {
    return NextResponse.json(
      {
        error: "Course session ID is required",
      },
      { status: 400 }
    );
  }
  const requestBody = await req.json();
  try {
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors,
        },
        { status: 400 }
      );
    }
  }

  const { studentId } = requestBody;
  // Check that the user is a student and user is not already part of the course
  const studentInRoster = await db.query.roster.findFirst({
    where: and(
      eq(roster.courseSessionId, courseSessionId),
      eq(roster.studentId, studentId)
    ),
  });
  if (studentInRoster) {
    return NextResponse.json(
      {
        error: `StudentID ${studentId} already enrolled in this course session`,
      },
      { status: 409 }
    );
  }
  await db.insert(roster).values({
    id: crypto.randomUUID(),
    courseSessionId: courseSessionId,
    studentId: studentId,
  });
  return NextResponse.json({
    studentId: studentId,
    courseSessionId: courseSessionId,
    status: "ok",
  });
}
