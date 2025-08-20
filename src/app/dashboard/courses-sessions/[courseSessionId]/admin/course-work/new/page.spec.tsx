import { CourseSessionClient } from "@/clients/course-session-client";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NewCourseWorkPage from "./page";

const accessLevels = ["student", "admin"];
let accessIdx = 0;

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/test.jpg",
        role: accessLevels[accessIdx],
      },
    },
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({
    courseSessionId: "mockedCourseSessionId",
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    query: {
      courseSessionId: "mockedCourseSessionId",
    },
  })),
}));

CourseSessionClient.fetchCourseSessionByIdAdmin = vi.fn().mockRejectedValue({});
CourseSessionClient.getCourseWeightings = vi.fn().mockResolvedValue([
  {
    id: "mockedWeightingId",
    title: "Mocked Weighting",
    description: "Mocked Description",
    percentage: 100,
  },
]);

describe("Courses-sessions, course-work, new course work - tests", () => {
  it("renders correctly with permission message", () => {
    accessIdx = 0;
    const { getByText } = render(<NewCourseWorkPage />);
    expect(
      getByText(/You do not have permission to view this page/i)
    ).toBeDefined();
  });
  it("renders the page properly as an admin", async () => {
    accessIdx = 1;
    const { getByText } = render(<NewCourseWorkPage />);
    expect(getByText(/new course work/i)).toBeDefined();
  });
});
