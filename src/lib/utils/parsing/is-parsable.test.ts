/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, test } from "vitest";
import { isParsable } from "./is-parsable";

describe("isParsable", () => {
  test("isParsable should return true for valid numeric strings", () => {
    expect(isParsable("123")).toBe(true);
    expect(isParsable("0")).toBe(true);
    expect(isParsable("-456")).toBe(true);
    expect(isParsable("3.14")).toBe(true);
    expect(isParsable("1e10")).toBe(false); // scientific notation
  });
  test("isParsable should return false for invalid numeric strings", () => {
    expect(isParsable("abc")).toBe(false);
    expect(isParsable("123abc")).toBe(false);
    expect(isParsable("")).toBe(false);
    expect(isParsable(" ")).toBe(false);
    expect(isParsable(null as any)).toBe(false);
    expect(isParsable(undefined as any)).toBe(false);
  });
  test("isParsable should return false for non-numeric strings", () => {
    expect(isParsable("NaN")).toBe(false);
    expect(isParsable("Infinity")).toBe(false);
    expect(isParsable("12.34.56")).toBe(false); // multiple decimal points
  });
});
