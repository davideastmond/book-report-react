import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { courseSession, roster } from "@/db/schema";
import { isMaxAllotment } from "@/lib/utils/db/course-enrollment-helpers";
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

  // Count the roster for this course session
  const isCourseFull = await isMaxAllotment(courseSessionId);
  if (isCourseFull) {
    return NextResponse.json(
      {
        error: `Course session ${courseSessionId} is full`,
      },
      { status: 409 }
    );
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
  // Check if the course session is locked
  const foundSession = await db.query.courseSession.findFirst({
    where: eq(courseSession?.id, courseSessionId),
  });
  if (foundSession && foundSession.isLocked) {
    return NextResponse.json(
      {
        error: `Course session ${courseSessionId} is locked and cannot be modified`,
      },
      { status: 403 }
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

export async function DELETE(
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
  const { studentId } = requestBody;

  // For security, if this is a student making the request, ensure they are only trying to remove themselves
  if (
    authSession.user.role === "student" &&
    authSession.user.id !== studentId
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized to remove another student",
      },
      { status: 403 }
    );
  }

  // Check that the user is a student and user is part of the course
  const studentInRoster = await db.query.roster.findFirst({
    where: and(
      eq(roster.courseSessionId, courseSessionId),
      eq(roster.studentId, studentId)
    ),
  });
  if (!studentInRoster) {
    return NextResponse.json(
      {
        error: `StudentID ${studentId} not enrolled in this course session`,
      },
      { status: 409 }
    );
  }

  // Check if the course session is locked
  const foundSession = await db.query.courseSession.findFirst({
    where: eq(courseSession.id, courseSessionId),
  });
  if (foundSession && foundSession.isLocked) {
    return NextResponse.json(
      {
        error: `Course session ${courseSessionId} is locked and cannot be modified`,
      },
      { status: 403 }
    );
  }
  await db
    .delete(roster)
    .where(
      and(
        eq(roster.courseSessionId, courseSessionId),
        eq(roster.studentId, studentId)
      )
    );

  return NextResponse.json({
    studentId: studentId,
    courseSessionId: courseSessionId,
    status: "ok",
  });
}
