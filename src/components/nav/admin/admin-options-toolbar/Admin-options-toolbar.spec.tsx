import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminOptionsToolbar } from "./Admin-options-toolbar";

describe("AdminOptionsToolbar", () => {
  // Add your tests here
  it("renders correctly", () => {
    // Test implementation
    const { getByText } = render(<AdminOptionsToolbar />);
    expect(getByText(/completed courses summary/i)).toBeDefined();
    expect(getByText(/student query/i)).toBeDefined();
  });
});
