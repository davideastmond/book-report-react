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
  patchCourseSession: async (
    courseSessionId: string,
    { description, sessionStart, sessionEnd }: Partial<CourseSession>
  ) => {
    let content = {};
    if (description) {
      content = { description };
    }
    if (sessionStart) {
      content = { ...content, sessionStart };
    }
    if (sessionEnd) {
      content = { ...content, sessionEnd };
    }
    const res = await fetch(`/api/courses/sessions/${courseSessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...content,
      }),
    });
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
    return res.json();
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
  removeStudentFromCourseSession: async ({
    courseSessionId,
    studentId,
  }: {
    courseSessionId: string;
    studentId: string;
  }): Promise<void> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/student`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to remove user from session");
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
  toggleLockedStatusForCourseSession: async (
    courseSessionId: string
  ): Promise<void> => {
    const res = await fetch(`/api/courses/sessions/${courseSessionId}/lock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to toggle locked status for course session");
    }
  },
};
