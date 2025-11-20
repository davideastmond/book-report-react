// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";
import { apiGetFinalGradeReport } from "./api";

describe("Final Grade Report API", () => {
  vi.mock("@/db/index", () => ({
    db: {
      select: vi.fn(() => {
        return {
          from: vi.fn(() => ({
            where: vi.fn(() => ({
              innerJoin: vi.fn(() => ({
                innerJoin: vi.fn(() => ({
                  innerJoin: vi.fn(() => ({
                    innerJoin: vi.fn(() => ({
                      innerJoin: vi.fn(() => ({
                        innerJoin: vi.fn().mockResolvedValue([
                          {
                            studentFirstName: "John",
                            studentLastName: "Doe",
                            courseName: "Introduction to Testing",
                            studentId: "student-123",
                            courseSessionId: "test-course-session-id",
                            sessionStart: new Date("2023-01-01"),
                            sessionEnd: new Date("2023-06-01"),
                          },
                        ]),
                      })),
                    })),
                  })),
                })),
              })),
            })),
          })),
        };
      }),
    },
  }));
  test("Returns a properly formatted object", async () => {
    const result = await apiGetFinalGradeReport("test-course-session-id");
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("data");
    expect(result.data).toHaveProperty("report");
    expect(result.data).toHaveProperty("courseData");
    expect(result.data!.courseData).toHaveProperty(
      "courseName",
      "Introduction to Testing"
    );
    expect(result.data!.courseData).toHaveProperty(
      "courseSessionId",
      "test-course-session-id"
    );
    expect(result.data!.courseData).toHaveProperty("sessionStart");
    expect(result.data!.courseData).toHaveProperty("sessionEnd");
  });
});
