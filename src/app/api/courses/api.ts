"use server";
import { db } from "@/db/index";

export async function apiGetCourses() {
  try {
    return db.query.course.findMany();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}
