import { cleanup } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
vi.mock("next/navigation", () => {
  return {
    useRouter: () => {
      return {
        route: "/",
        pathname: "",
        query: "",
        asPath: "",
        push: vi.fn(),
        events: {
          on: vi.fn(),
          off: vi.fn(),
        },
        beforePopState: vi.fn(() => null),
        prefetch: vi.fn(() => null),
      };
    },
  };
});

beforeEach(() => {
  cleanup();
});
