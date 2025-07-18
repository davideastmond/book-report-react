import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GradeWeight } from "../Grade-Weight";

describe("Grade Weight component tests", () => {
  it("render the component with inputs and button", () => {
    const { getByPlaceholderText, getByRole } = render(
      <GradeWeight name="Test Weight" onRemove={vi.fn()} />
    );

    expect(getByPlaceholderText("Weight Name")).toBeDefined();
    expect(getByPlaceholderText("% Percentage")).toBeDefined();
    expect(getByRole("button", { name: "Remove" })).toBeDefined();
  });

  it("handleRemove function is called when button is clicked", () => {
    const mockOnRemove = vi.fn();
    const { getByRole } = render(
      <GradeWeight name="Test Weight" onRemove={mockOnRemove} />
    );

    const removeButton = getByRole("button", { name: "Remove" });
    removeButton.click();

    expect(mockOnRemove).toHaveBeenCalledWith("Test Weight");
  });
});
