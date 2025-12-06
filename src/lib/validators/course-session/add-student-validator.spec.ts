import { describe, expect, test } from "vitest";
import { addStudentValidator } from "./add-student-validator";

describe("add-student-validator", () => {
  test.each([
    { userId: "", throws: true },
    { userId: "not-a-uuid", throws: true },
    { userId: "12345", throws: true },
    { userId: "g123e4567-e89b-12d3-a456-426614174000", throws: true }, // invalid character 'g'
    { userId: "987e6543-e21b-12d3-a456-426614174000", throws: false }, // valid UUID
  ])("Invalid userId '$userId' fails validation", ({ userId, throws }) => {
    if (throws) {
      expect(() => {
        addStudentValidator.parse({ userId });
      }).toThrow();
    } else {
      expect(() => {
        addStudentValidator.parse({ userId });
      }).not.toThrow();
    }
  });
});
