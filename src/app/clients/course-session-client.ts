import { CourseSession } from "@/db/schema";

export const CourseSessionClient = {
  createCourseSession: async ({
    courseId,
    sessionStart,
    sessionEnd,
  }: Partial<CourseSession>): Promise<void> => {
    const res = await fetch("/api/courses/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        sessionStart,
        sessionEnd,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to create course");
    }
  },
};
