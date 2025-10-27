"use server";
import { db } from "@/db/index";
import { Course } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";

export async function apiGetCourses(): Promise<ApiResult<Course[]>> {
  try {
    const results = await db.query.course.findMany();
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, message: "Failed to fetch courses" };
  }
}
