// @vitest-environment node
import { GET as handler } from "@/api/courses/route";
import { afterAll, describe, expect, test, vi } from "vitest";

afterAll(() => {
  vi.resetAllMocks();
});
vi.mock("drizzle-orm/postgres-js", () => {
  return {
    drizzle: () => ({
      query: {
        course: {
          findMany: vi
            .fn()
            .mockImplementationOnce(() => Promise.reject(new Error("DB error")))
            .mockImplementationOnce(() =>
              Promise.resolve([{ id: 1, name: "Course 1" }])
            ),
        },
      },
    }),
  };
});
describe("GET /api/courses", () => {
  test("should return 500 error", async () => {
    const response = await handler();
    expect(response.status).toBe(500);
  });
  test("should return a 200 response", async () => {
    const response = await handler();
    expect(response.status).toBe(200);
  });
});
