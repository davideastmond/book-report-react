import { Course } from "@/db/schema";

export const CourseClient = {
  fetchCourses: async (): Promise<Partial<Course>[]> => {
    const res = await fetch("/api/courses");
    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }
    const data = await res.json();
    return data;
  },
};
