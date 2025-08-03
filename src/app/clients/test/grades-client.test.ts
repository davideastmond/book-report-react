/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, it, vi } from "vitest";
import { GradesClient } from "../grades-client";

describe("GradesClient tests", () => {
  it("should fetch grades for student with date range successfully", async () => {
    const mockGrades = {
      data: [
        { courseId: "1", grade: "A", date: "2023-01-01" },
        { courseId: "2", grade: "B", date: "2023-01-02" },
      ],
      gpa: "3.5",
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGrades),
      })
    ) as any;

    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-01-31");
    const studentId = "12345";

    const result = await GradesClient.getGradesForStudentWithDateRange({
      studentId,
      startDate,
      endDate,
    });

    expect(result).toEqual(mockGrades);
  });

  it("should throw an error when fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as any;

    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-01-31");
    const studentId = "12345";

    await expect(
      GradesClient.getGradesForStudentWithDateRange({
        studentId,
        startDate,
        endDate,
      })
    ).rejects.toThrow("Failed to fetch grades");
  });
});
