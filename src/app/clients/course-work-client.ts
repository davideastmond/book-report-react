import { AcademicTask } from "@/db/schema";

export const CourseWorkClient = {
  createCourseWork: async ({
    data,
    courseSessionId,
  }: {
    data: Partial<AcademicTask>;
    courseSessionId: string;
  }): Promise<void> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/course-work`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw Error(
        `Failed to create course work: ${errorData.error || "Unknown error"}`
      );
    }
  },
  getCourseWorkForSession: async (
    courseSessionId: string
  ): Promise<AcademicTask[]> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/course-work`
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw Error(
        `Failed to fetch course work: ${errorData.error || "Unknown error"}`
      );
    }
    return res.json();
  },
  getCourseWorkById: async ({
    courseSessionId,
    courseWorkId,
  }: {
    courseSessionId: string;
    courseWorkId: string;
  }): Promise<AcademicTask> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/course-work/${courseWorkId}`
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw Error(
        `Failed to fetch course work by ID: ${
          errorData.error || "Unknown error"
        }`
      );
    }
    return res.json();
  },
  updateCourseWorkAttributesById: async (
    courseSessionId: string,
    courseWorkId: string,
    data: Partial<AcademicTask>
  ): Promise<void> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/course-work/${courseWorkId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw Error(
        `Failed to update course work attributes: ${
          errorData.error || "Unknown error"
        }`
      );
    }
  },
};
