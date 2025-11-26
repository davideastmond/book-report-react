import { db } from "@/db/index";
import * as courseEnrollmentHelpers from "@/lib/utils/db/course-enrollment-helpers";
import { describe, expect, test, vi } from "vitest";
import { apiAddStudentToCourseSession } from "./api";

const isMaxAllotmentSpy = vi
  .spyOn(courseEnrollmentHelpers, "isMaxAllotment")
  .mockImplementationOnce(async () => true)
  .mockImplementationOnce(async () => false);

describe("src/app/api/courses/sessions/[courseSessionId]/student/api.ts", () => {
  test("Should return a negative success when adding to a full course", async () => {
    const result = await apiAddStudentToCourseSession(
      "test-course-session-id",
      "test-student-id"
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe("Course session is full");
    expect(isMaxAllotmentSpy).toHaveBeenCalledOnce();
  });
  test("expect an negative success when adding a student who is already enrolled", async () => {
    // Mock the database query to return an existing enrollment
    vi.spyOn(courseEnrollmentHelpers, "isMaxAllotment").mockResolvedValue(
      false
    );
    const dbQuerySpy = vi
      .spyOn(db.query.roster, "findFirst")
      .mockResolvedValueOnce({
        id: "existing-enrollment-id",
        courseSessionId: "test-course-session-id",
        studentId: "test-student-id",
      } as any);

    const result = await apiAddStudentToCourseSession(
      "test-course-session-id",
      "test-student-id"
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "StudentID test-student-id already enrolled in this course session"
    );
    expect(dbQuerySpy).toHaveBeenCalledOnce();
    expect(isMaxAllotmentSpy).toHaveBeenCalledOnce();
  });
  test("expect a negative success when adding a student to a locked course session", async () => {
    // Mock the database query to return no existing enrollment
    vi.spyOn(courseEnrollmentHelpers, "isMaxAllotment").mockResolvedValue(
      false
    );
    vi.spyOn(db.query.roster, "findFirst").mockResolvedValueOnce(undefined);
    const dbSessionQuerySpy = vi
      .spyOn(db.query.courseSession, "findFirst")
      .mockResolvedValueOnce({
        id: "test-course-session-id",
        isLocked: true,
      } as any);

    const result = await apiAddStudentToCourseSession(
      "test-course-session-id",
      "test-student-id"
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Course session test-course-session-id is locked and cannot be modified"
    );
    expect(dbSessionQuerySpy).toHaveBeenCalledOnce();
    expect(isMaxAllotmentSpy).toHaveBeenCalledOnce();
  });
  test("expect a successful addition with proper success message", async () => {
    vi.spyOn(courseEnrollmentHelpers, "isMaxAllotment").mockResolvedValue(
      false
    );
    vi.spyOn(db.query.roster, "findFirst").mockResolvedValueOnce(undefined);
    vi.spyOn(db.query.courseSession, "findFirst").mockResolvedValueOnce({
      id: "test-course-session-id",
      isLocked: false,
    } as any);

    const dbInsertSpy = vi.spyOn(db, "insert").mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);

    const result = await apiAddStudentToCourseSession(
      "test-course-session-id",
      "test-student-id"
    );

    expect(result.success).toBe(true);
    expect(result.message).toBeUndefined();
    expect(dbInsertSpy).toHaveBeenCalledWith(expect.anything());
  });
});
