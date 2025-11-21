import { apiGetCourses } from "@/api/courses/api";
import { Course } from "@/db/schema";

export const CourseClient = {
  fetchCourses: async (): Promise<Partial<Course>[]> => {
    const response = await apiGetCourses();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch courses");
    }
    return response.data!;
  },
};
