import { AcademicGrade, CourseSession, GradeWeight } from "@/db/schema";
import { AggregatedCourseAssignmentData } from "@/lib/controller/grades/aggregators/definitions";
import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
import {
  CourseSessionDataAPIResponse,
  CourseSessionInfo,
  CourseSessionsAPIResponse,
} from "@/lib/types/db/course-session-info";
import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { TableData } from "@/lib/types/grading/student/definitions";
import { WeightingData } from "@/lib/types/weighting/weighting-data";

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
      throw Error("Failed to create course");
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
    await fetch(`/api/courses/sessions/${courseSessionId}`, {
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
      throw Error("Failed to fetch course sessions");
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
      throw Error("Failed to fetch course sessions");
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
      throw Error("Failed to fetch course sessions");
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
      throw Error("Failed to add user to course session");
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
      throw Error("Failed to remove user from session");
    }
  },
  fetchAvailableCourses: async (
    showCompleted: boolean = false
  ): Promise<CourseSessionInfo[]> => {
    const res = await fetch(
      `/api/courses/sessions?showCompleted=${showCompleted}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw Error("Failed to fetch available courses");
    }
    return await res.json();
  },
  fetchGradesForCourseSession: async (
    courseSessionId: string
  ): Promise<AcademicGrade[]> => {
    const res = await fetch(`/api/courses/sessions/${courseSessionId}/grades`);

    if (!res.ok) {
      throw Error("Failed to fetch grades for course session");
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
      throw Error("Failed to submit grade updates for course session");
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
      throw Error("Failed to toggle locked status for course session");
    }
  },
  markCourseSessionAsCompleted: async (
    courseSessionId: string
  ): Promise<void> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/complete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw Error("Failed to mark course session as completed");
    }
  },
  createCourseWeighting: async (
    courseSessionId: string,
    payload: WeightingData
  ): Promise<void> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/weighting`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      throw Error("Failed to create course weighting");
    }
  },
  getCourseWeightings: async (
    courseSessionId: string
  ): Promise<GradeWeight[]> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/weighting`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw Error("Failed to fetch course weightings");
    }
    return res.json();
  },
  fetchGroupedCourseSessionByCourse: async (): Promise<GroupedCourseInfo[]> => {
    const res = await fetch("/api/courses/sessions/grouped", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw Error("Failed to fetch grouped course sessions");
    }
    return res.json();
  },
  getCourseGradeAverage: async (
    courseSessionId: string
  ): Promise<{
    courseSessionGradeAverage: number;
    courseSessionId: string;
    status: string;
  }> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/analytics/course-session-grade-average`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw Error("Failed to fetch course grade average");
    }
    return res.json();
  },
  getFinalGradeReport: async (
    courseSessionId: string
  ): Promise<{
    report: SummarizedData[];
    courseData: {
      courseName: string;
      courseCode: string;
      sessionStart: string;
      sessionEnd: string;
      courseSessionId: string;
    };
  }> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/analytics/final-grade-report`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw Error("Failed to fetch course final grade report");
    }
    const data: {
      courseData: {
        courseName: string;
        courseCode: string;
        sessionStart: string;
        sessionEnd: string;
        courseSessionId: string;
      };
      report: Record<string, SummarizedData>;
    } = await res.json();

    return { courseData: data.courseData, report: Object.values(data.report) };
  },
  getAssignmentsOverview: async (
    courseSessionId: string
  ): Promise<AggregatedCourseAssignmentData[]> => {
    const res = await fetch(
      `/api/courses/sessions/${courseSessionId}/analytics/assignment-overview`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw Error("Failed to fetch assignments overview");
    }
    return res.json();
  },
};
