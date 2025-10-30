import {
  apiGetCourseWorkById,
  apiUpdateCourseWorkAttributesById,
} from "@/api/courses/sessions/[courseSessionId]/course-work/[courseWorkId]/api";
import {
  apiCreateCourseWork,
  apiGetCourseWorkForSession,
} from "@/api/courses/sessions/[courseSessionId]/course-work/api";
import { AcademicTask } from "@/db/schema";
import { AcademicTaskWithWeighting } from "@/lib/types/course-work/definitions";

export const CourseWorkClient = {
  createCourseWork: async ({
    data,
    courseSessionId,
  }: {
    data: Partial<AcademicTask>;
    courseSessionId: string;
  }): Promise<void> => {
    const result = await apiCreateCourseWork(courseSessionId, data);
    if (!result.success) {
      throw Error(`Failed to create course work: ${result.message}`);
    }
  },
  getCourseWorkForSession: async (
    courseSessionId: string
  ): Promise<AcademicTaskWithWeighting[]> => {
    const result = await apiGetCourseWorkForSession(courseSessionId);
    if (!result.success) {
      throw Error(`Failed to fetch course work: ${result.message}`);
    }
    return result.data!;
  },
  getCourseWorkById: async ({
    courseSessionId,
    courseWorkId,
  }: {
    courseSessionId: string;
    courseWorkId: string;
  }): Promise<AcademicTask> => {
    const result = await apiGetCourseWorkById(courseWorkId);
    if (!result.success) {
      throw Error(`Failed to fetch course work by ID: ${result.message}`);
    }
    return result.data!;
  },

  updateCourseWorkAttributesById: async (
    courseWorkId: string,
    data: Partial<AcademicTask>
  ): Promise<void> => {
    const result = await apiUpdateCourseWorkAttributesById(courseWorkId, data);
    if (!result.success) {
      throw Error(`Failed to update course work attributes: ${result.message}`);
    }
  },
};
