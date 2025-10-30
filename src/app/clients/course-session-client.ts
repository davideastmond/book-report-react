import { apiGetAssignmentsOverview } from "@/api/courses/sessions/[courseSessionId]/analytics/assignment-overview/api";
import { apiGetCourseGradeAverage } from "@/api/courses/sessions/[courseSessionId]/analytics/course-session-grade-average/api";
import { apiGetFinalGradeReport } from "@/api/courses/sessions/[courseSessionId]/analytics/final-grade-report/api";
import {
  apiGetCoursesSessionById,
  apiPatchCoursesSessionById,
} from "@/api/courses/sessions/[courseSessionId]/api";
import { apiMarkCourseSessionAsCompleted } from "@/api/courses/sessions/[courseSessionId]/complete/api";
import {
  apiGetGradesForCourseSession,
  apiSubmitGradeUpdatesForCourseSession,
} from "@/api/courses/sessions/[courseSessionId]/grades/api";
import { apiToggleLockedStatusForCourseSession } from "@/api/courses/sessions/[courseSessionId]/lock/api";
import {
  apiAddStudentToCourseSession,
  apiRemoveStudentFromCourseSession,
} from "@/api/courses/sessions/[courseSessionId]/student/api";
import {
  apiCreateCourseWeighting,
  apiGetCourseWeightings,
} from "@/api/courses/sessions/[courseSessionId]/weighting/api";
import {
  apiGetAllAvailableCourses,
  apiPostCreateCourseSession,
} from "@/api/courses/sessions/api";
import { apiGetGroupedCoursesSessionsByCourse } from "@/api/courses/sessions/grouped/api";
import { apiAdminGetCoursesSessions } from "@/api/user/admin/me/course-sessions/api";
import { apiUserGetCoursesSessions } from "@/api/user/me/course-sessions/api";
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

export const CourseSessionClient = {
  createCourseSession: async ({
    courseId,
    sessionStart,
    sessionEnd,
    description,
    studentAllotment,
  }: Partial<CourseSession>): Promise<void> => {
    const result = await apiPostCreateCourseSession({
      courseId,
      sessionStart,
      sessionEnd,
      description,
      studentAllotment,
    });
    if (!result.success) {
      throw new Error(result.message || "Failed to create course session");
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

    await apiPatchCoursesSessionById(courseSessionId, content);
  },
  fetchCourseSessionsAdmin: async (): Promise<CourseSessionInfo[]> => {
    const result = await apiAdminGetCoursesSessions();
    if (!result.success) throw new Error(result.message!);
    return result.data!;
  },
  fetchCourseSessionsByStudent:
    async (): Promise<CourseSessionsAPIResponse> => {
      return apiUserGetCoursesSessions() as Promise<CourseSessionsAPIResponse>;
    },
  fetchCourseSessionByIdAdmin: async (
    id: string
  ): Promise<CourseSessionDataAPIResponse> => {
    return apiGetCoursesSessionById(
      id
    ) as Promise<CourseSessionDataAPIResponse>;
  },
  addStudentToCourseSession: async ({
    courseSessionId,
    studentId,
  }: {
    courseSessionId: string;
    studentId: string;
  }): Promise<void> => {
    const result = await apiAddStudentToCourseSession(
      courseSessionId,
      studentId
    );

    if (!result.success) {
      throw Error(result.message || "Failed to add user to course session");
    }
  },
  removeStudentFromCourseSession: async ({
    courseSessionId,
    studentId,
  }: {
    courseSessionId: string;
    studentId: string;
  }): Promise<void> => {
    const result = await apiRemoveStudentFromCourseSession(
      courseSessionId,
      studentId
    );
    if (!result.success) {
      throw Error(
        result.message || "Failed to remove user from course session"
      );
    }
  },
  fetchAvailableCourses: async (
    showCompleted: boolean = false
  ): Promise<CourseSessionInfo[]> => {
    const result = await apiGetAllAvailableCourses(showCompleted);
    if (!result.success) throw new Error(result.message!);
    return result.data!;
  },
  fetchGradesForCourseSession: async (
    courseSessionId: string
  ): Promise<AcademicGrade[]> => {
    const result = await apiGetGradesForCourseSession(courseSessionId);
    if (!result.success) {
      throw new Error(
        result.message || "Failed to fetch grades for course session"
      );
    }

    return result.data!;
  },
  submitGradeUpdatesForCourseSession: async ({
    courseSessionId,
    data,
  }: {
    courseSessionId: string;
    data: TableData;
  }): Promise<void> => {
    const result = await apiSubmitGradeUpdatesForCourseSession(
      courseSessionId,
      data
    );
    if (!result.success) {
      throw new Error(
        result.message || "Failed to submit grade updates for course session"
      );
    }
  },
  toggleLockedStatusForCourseSession: async (
    courseSessionId: string
  ): Promise<void> => {
    const result = await apiToggleLockedStatusForCourseSession(courseSessionId);
    if (!result.success) {
      throw new Error(
        result.message || "Failed to toggle locked status for course session"
      );
    }
  },
  markCourseSessionAsCompleted: async (
    courseSessionId: string
  ): Promise<void> => {
    const result = await apiMarkCourseSessionAsCompleted(courseSessionId);

    if (!result.success) {
      if (result.status === 422) {
        throw Error(
          "Please ensure all grade-weights have at least one course-work item assigned before marking the course session as complete."
        );
      }
      throw Error(
        result.message || "Failed to mark course session as completed."
      );
    }
  },
  createCourseWeighting: async (
    courseSessionId: string,
    payload: GradeWeight[]
  ): Promise<void> => {
    const result = await apiCreateCourseWeighting(courseSessionId, payload);
    if (!result.success) {
      throw Error(result.message || "Failed to create course weighting");
    }
  },
  getCourseWeightings: async (
    courseSessionId: string
  ): Promise<GradeWeight[]> => {
    const result = await apiGetCourseWeightings(courseSessionId);
    if (!result.success) {
      throw Error(result.message || "Failed to fetch course weightings");
    }
    return result.data!;
  },
  fetchGroupedCourseSessionByCourse: async (): Promise<GroupedCourseInfo[]> => {
    const result = await apiGetGroupedCoursesSessionsByCourse();
    if (!result.success) throw new Error(result.message!);
    return result.data!;
  },
  getCourseGradeAverage: async (
    courseSessionId: string
  ): Promise<{
    courseSessionGradeAverage: number;
    courseSessionId: string;
  }> => {
    const result = await apiGetCourseGradeAverage(courseSessionId);
    if (!result.success) {
      throw Error(result.message || "Failed to fetch course grade average");
    }

    return result.data!;
  },
  getFinalGradeReport: async (
    courseSessionId: string
  ): Promise<{
    report: SummarizedData[];
    courseData: {
      courseName?: string | null;
      courseCode?: string | null;
      sessionStart?: string | null;
      sessionEnd?: string | null;
      courseSessionId?: string | null;
    };
  }> => {
    const result = await apiGetFinalGradeReport(courseSessionId);
    if (!result.success) {
      throw Error(result.message || "Failed to fetch final grade report");
    }

    const { courseData, report } = result.data!;

    return {
      courseData,
      report: Object.values(report),
    };
  },
  getAssignmentsOverview: async (
    courseSessionId: string
  ): Promise<AggregatedCourseAssignmentData[]> => {
    const result = await apiGetAssignmentsOverview(courseSessionId);
    if (!result.success) {
      throw Error(result.message || "Failed to fetch assignments overview");
    }
    return result.data!;
  },
};
