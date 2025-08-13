import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Spinner />);
    expect(getByText("Loading...")).toBeDefined();
  });
});
