"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, CourseSession, courseSession, user } from "@/db/schema";
import { createCourseSessionValidator } from "@/lib/validators/course-session/create-course-session-validator";
import { eq, or } from "drizzle-orm";
import { getServerSession } from "next-auth";

import z from "zod";

export async function apiPostCreateCourseSession(
  requestBody: Partial<CourseSession>
) {
  const authSession = await getServerSession(authOptions);

  if (!authSession || !authSession.user) {
    throw new Error("Unauthorized");
  }

  // Validate the request body
  try {
    createCourseSessionValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation error: " + error.errors.map((e) => e.message).join(", ")
      );
    }
  }
  const { courseId, sessionStart, sessionEnd, description, studentAllotment } =
    requestBody;

  try {
    await db.insert(courseSession).values({
      id: crypto.randomUUID(),
      courseId: courseId!,
      sessionStart: new Date(sessionStart!),
      sessionEnd: new Date(sessionEnd!),
      instructorId: authSession.user.id as string,
      description: description || null,
      studentAllotment: studentAllotment!,
    });
  } catch (error) {
    throw new Error(
      "An error occurred while creating the course:" + (error as Error).message
    );
  }
}

// This route gets all available courses for browsing purposes
export async function apiGetAllAvailableCourses(showCompleted: boolean) {
  const authSession = await getServerSession(authOptions);

  if (!authSession || !authSession.user) {
    throw new Error("Unauthorized");
  }

  const conditionalQuery = showCompleted
    ? or(
        eq(courseSession.isCompleted, true),
        eq(courseSession.isCompleted, false)
      )
    : eq(courseSession.isCompleted, false);

  try {
    const availableCourses = await db
      .select({
        courseId: course.id,
        courseName: course.name,
        courseCode: course.course_code,
        courseSessionId: courseSession.id,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        instructorId: user.id,
        instructorFirstName: user.firstName,
        instructorLastName: user.lastName,
        description: courseSession.description,
        studentAllotment: courseSession.studentAllotment,
        isLocked: courseSession.isLocked,
        isCompleted: courseSession.isCompleted,
      })
      .from(courseSession)
      .where(conditionalQuery)
      .innerJoin(course, eq(course.id, courseSession.courseId))
      .innerJoin(user, eq(user.id, courseSession.instructorId));
    return availableCourses;
  } catch (error) {
    throw new Error(
      "An error occurred while fetching courses:" + (error as Error).message
    );
  }
}
