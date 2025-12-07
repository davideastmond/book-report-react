import { describe, expect, test } from "vitest";

import { weightDataValidator } from "./weight-data-validator";

describe("Weight Data Validator Tests", () => {
  test("valid data passes validation", () => {
    const validData = [
      { name: "Assignment 1", percentage: 50, id: "a1" },
      { name: "Assignment 2", percentage: 50, id: "a2" },
    ];
    expect(() => weightDataValidator.parse(validData)).not.toThrow();
  });
  test("invalid data with total percentage not equal to 100 fails validation", () => {
    const invalidData = [
      { name: "Assignment 1", percentage: 30, id: "a1" },
      { name: "Assignment 2", percentage: 50, id: "a2" },
    ];
    expect(() => weightDataValidator.parse(invalidData)).toThrow(
      "Total percentage must equal 100"
    );
  });
});
