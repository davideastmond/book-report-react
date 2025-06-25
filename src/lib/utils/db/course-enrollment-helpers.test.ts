import { describe, expect, test, vi } from "vitest";
import {
  countEnrolled,
  getStudentAllotment,
  isMaxAllotment,
  isStudentEnrolled,
} from "./course-enrollment-helpers";

let setIndex = 0;
const mockCountDataReturnValues = [
  [
    {
      count: 5,
      studentAllotment: 10,
    },
  ],
  [
    {
      count: 5,
      studentAllotment: 5,
    },
  ],
];

const mockEnrollmentReturnValues = [
  {
    firstName: "test",
    lastName: test,
  },
  null,
];
describe("Course Enrollment Helpers", () => {
  vi.mock("@/db/index", () => ({
    db: {
      select: vi.fn(() => {
        return {
          from: vi.fn(() => ({
            where: vi.fn().mockImplementation(() => {
              return mockCountDataReturnValues[setIndex];
            }),
          })),
        };
      }),
      query: {
        roster: {
          findFirst: vi.fn(() => {
            return mockEnrollmentReturnValues[setIndex];
          }),
        },
      },
    },
  }));
  describe("countEnrolled", () => {
    test("should return the count of enrolled students for a course session", async () => {
      setIndex = 0;
      const courseSessionId = "test-session-id";
      const result = await countEnrolled(courseSessionId);
      expect(result).toBe(5);
    });
  });
  describe("getStudentAllotment", () => {
    test("should return the student allotment for a course session", async () => {
      setIndex = 0;
      const courseSessionId = "test-session-id";
      const result = await getStudentAllotment(courseSessionId);
      expect(result).toBe(10);
    });
  });
  describe("isMaxAllotment", () => {
    test("should return true if the current student count is at max allotment", async () => {
      setIndex = 1;
      const courseSessionId = "test-session-id";
      const result = await isMaxAllotment(courseSessionId);

      expect(result).toBe(true);
    });
    test("should return false if the current student count is below max allotment", async () => {
      setIndex = 0;
      const courseSessionId = "test-session-id";
      const result = await isMaxAllotment(courseSessionId);

      expect(result).toBe(false);
    });
  });
  describe("isStudentEnrolled", () => {
    test("should return true if the student is enrolled in the course session", async () => {
      setIndex = 0;
      const courseSessionId = "test-session-id";
      const studentId = "test-student-id";
      const result = await isStudentEnrolled({
        courseSessionId,
        studentId,
      });
      expect(result).toBe(true);
    });
    test("should return false if the student is not enrolled in the course session", async () => {
      setIndex = 1;
      const courseSessionId = "test-session-id";
      const studentId = "test-student-id";
      const result = await isStudentEnrolled({
        courseSessionId,
        studentId,
      });
      expect(result).toBe(false);
    });
  });
});
