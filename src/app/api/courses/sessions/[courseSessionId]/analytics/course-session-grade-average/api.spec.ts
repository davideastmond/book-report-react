import { CourseSessionGradeCalculator } from "@/lib/controller/grades/calculations/course-session-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { describe, expect, test, vi } from "vitest";
import { apiGetCourseGradeAverage } from "./api";
vi.spyOn(GradeController, "getRawDataForCourseSessionById").mockResolvedValue(
  []
);

vi.spyOn(
  CourseSessionGradeCalculator.prototype,
  "getAverageStudentGrade"
).mockReturnValue(75);

describe("Course session grade average API tests", () => {
  test("Returns a successful response", async () => {
    const result = await apiGetCourseGradeAverage("test-course-session-id");
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.courseSessionGradeAverage).toBe(75);
    expect(result.data?.courseSessionId).toBe("test-course-session-id");
  });
  test("Returns an unsuccessful response on error", async () => {
    vi.spyOn(
      GradeController,
      "getRawDataForCourseSessionById"
    ).mockRejectedValueOnce(new Error("Database error"));

    const result = await apiGetCourseGradeAverage("test-course-session-id");
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Failed to fetch course session data: Database error"
    );
  });
});
