import { vi } from "vitest";
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
