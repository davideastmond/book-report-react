import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { courseSession } from "@/db/schema";
import { createCourseSessionValidator } from "@/lib/validators/course-session/create-course-session-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  const authSession = await getServerSession(authOptions);

  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const requestBody = await request.json();

  // Validate the request body
  try {
    createCourseSessionValidator.parse(requestBody);
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
  const { courseId, sessionStart, sessionEnd, description } = requestBody;

  try {
    await db.insert(courseSession).values({
      id: crypto.randomUUID(),
      courseId: courseId,
      sessionStart: new Date(sessionStart),
      sessionEnd: new Date(sessionEnd),
      instructorId: authSession.user.id,
      description: description || null,
    });
    return NextResponse.json({ message: "Course created successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while creating the course.",
      },
      { status: 500 }
    );
  }
}
