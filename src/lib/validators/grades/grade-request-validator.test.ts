import { URLSearchParams } from "url";
import { describe, expect, it } from "vitest";
import { validateGradesAPIRequest } from "./grades-request-validator";
describe("Grade Request Validator Tests", () => {
  it("all fields are supplied and function doesn't throw", () => {
    const request = new URLSearchParams({
      filter: "courseSession",
      startDate: "2023-01-01",
      studentId: "student123",
    });
    expect(() => validateGradesAPIRequest(request)).not.toThrow();
  });

  const testCases = [
    [
      "Missing filter parameter",
      new URLSearchParams({
        startDate: "2023-01-01",
        studentId: "student123",
      }),
    ],
    [
      "Missing startDate parameter",
      new URLSearchParams({
        filter: "courseSession",
        studentId: "student123",
      }),
    ],
    [
      "Missing studentId parameter",
      new URLSearchParams({
        filter: "courseSession",
        startDate: "2023-01-01",
      }),
    ],
  ];
  it.each(testCases)("throws error for %s", (message, query) => {
    expect(() => validateGradesAPIRequest(query as URLSearchParams)).toThrow(
      message as string
    );
  });
});
