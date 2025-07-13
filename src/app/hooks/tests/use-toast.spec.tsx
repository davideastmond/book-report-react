import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useToast } from "../use-toast";

describe("hooks - useToast", () => {
  it("should show a toast message", () => {
    const { result } = renderHook(() => useToast());
    result.current.showToast("Test message");

    const { getByTestId } = render(result.current.ToastElement());
    // Wait for show
    setTimeout(() => {
      expect(getByTestId("toast")).toBeDefined();
    }, 2000);

    // The toast should disappear after 3 seconds
    setTimeout(() => {
      expect(getByTestId("toast")).not.toBeDefined();
    }, 2000);
  });
});
