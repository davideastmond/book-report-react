import { AcademicGrade, CourseSession } from "@/db/schema";
import {
  CourseSessionDataAPIResponse,
  CourseSessionInfo,
  CourseSessionsAPIResponse,
} from "@/lib/types/db/course-session-info";
import { TableData } from "@/lib/types/grading/definitions";

export const CourseSessionClient = {
  createCourseSession: async ({
    courseId,
    sessionStart,
    sessionEnd,
    description,
    studentAllotment,
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
        description,
        studentAllotment,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to create course");
    }
  },
  fetchCourseSessionsAdmin: async (): Promise<CourseSessionsAPIResponse> => {
    const res = await fetch("/api/user/admin/me/course-sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch course sessions");
    }

    return res.json();
  },
  fetchCourseSessionsByStudent: async () => {
    const res = await fetch("/api/user/me/course-sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch course sessions");
    }
    const retVals = await res.json();
    console.log("students courses", retVals);
    return retVals;
  },
  fetchCourseSessionByIdAdmin: async (
    id: string
  ): Promise<CourseSessionDataAPIResponse> => {
    const res = await fetch(`/api/courses/sessions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch course sessions");
    }

    return res.json();
  },
  addStudentToCourseSession: async ({
    courseSessionId,
    studentId,
  }: {
    courseSessionId: string;
    studentId: string;
  }): Promise<void> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/student`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to add user to course session");
    }
  },
  fetchAvailableCourses: async (): Promise<CourseSessionInfo[]> => {
    const res = await fetch("/api/courses/sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch available courses");
    }
    return await res.json();
  },
  fetchGradesForCourseSession: async (
    courseSessionId: string
  ): Promise<AcademicGrade[]> => {
    const res = await fetch(`/api/courses/sessions/${courseSessionId}/grades`);

    if (!res.ok) {
      throw new Error("Failed to fetch grades for course session");
    }
    return await res.json();
  },
  submitGradeUpdatesForCourseSession: async ({
    courseSessionId,
    data,
  }: {
    courseSessionId: string;
    data: TableData;
  }): Promise<void> => {
    const res = await fetch(`/api/courses/sessions/${courseSessionId}/grades`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to submit grade updates for course session");
    }
  },
};
