import { describe, expect, test } from "vitest";
import { calculateGPA } from "./gpa-calculator";
describe("GPA Calculator Tests", () => {
  test("return null if no grades are provided", () => {
    const inputData = {};
    const result = calculateGPA(inputData);
    expect(result).toBeNull();
  });
  test("should calculate GPA correctly with default factor", () => {
    const inputData = {
      course1: 85,
      course2: 90,
      course3: 75,
    };
    const result = calculateGPA(inputData);
    expect(result).toBeCloseTo(3.333); // 85 + 90 + 75 = 250 / 3 = ~83.33, GPA = (83.33 * 4) / 100 = ~3.33
  });
  test("should calculate GPA correctly with custom factor", () => {
    const inputData = {
      course1: 85,
      course2: 90,
      course3: 75,
    };
    const result = calculateGPA(inputData, 5);
    expect(result).toBeCloseTo(4.1667, 4); // 85 + 90 + 75 = 250 / 3 = ~83.33, GPA = (83.33 * 5) / 100 = ~4.1667
  });
});
