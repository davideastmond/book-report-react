import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { LoginForm } from "./Login-form";

describe("LoginForm", () => {
  test("renders correctly", () => {
    const { getByLabelText, getByRole } = render(<LoginForm />);
    expect(getByLabelText(/e-mail/i)).toBeDefined();
    expect(getByLabelText(/password/i)).toBeDefined();
    expect(getByRole("button", { name: /submit/i })).toBeDefined();
  });
});
