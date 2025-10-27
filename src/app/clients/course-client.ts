import { apiGetCourses } from "@/api/courses/api";
import { Course } from "@/db/schema";

export const CourseClient = {
  fetchCourses: async (): Promise<Partial<Course>[]> => {
    return apiGetCourses();
  },
};
