import { render, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useToast } from "../use-toast";

describe("hooks - useToast", () => {
  it("should not show toast initially", () => {
    const { result } = renderHook(() => useToast());
    const { queryByTestId } = render(result.current.ToastElement());
    expect(queryByTestId("toast")).toBeNull();
  });
  it("should show a toast message when showToast is called", async () => {
    const { result } = renderHook(() => useToast());
    result.current.showToast("Hello world");
    await waitFor(() => {
      const { getByTestId } = render(result.current.ToastElement());
      expect(getByTestId("toast").textContent).toBe("Hello world");
    });
  });
  it("should hide the toast after 3 seconds", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());
    result.current.showToast("Hide me");
    vi.advanceTimersByTime(3000);
    render(result.current.ToastElement());
    const { queryByTestId } = render(result.current.ToastElement());
    expect(queryByTestId("toast")).toBeNull();

    vi.useRealTimers();
  });
});
