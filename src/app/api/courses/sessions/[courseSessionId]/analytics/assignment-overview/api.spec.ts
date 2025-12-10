// @vitest-environment jsdom
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { describe, expect, test, vi } from "vitest";
import { apiGetAssignmentsOverview } from "./api";
const serverSessionMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: () => serverSessionMock(),
}));

vi.spyOn(GradeController, "getRawDataForCourseSessionById").mockResolvedValue([
  {
    academicTaskId: "assignment-1",
    academicTaskName: "Assignment 1",
    academicTaskType: "assignment",
    courseSessionId: "course-session-1",
    gradeWeightId: "weight-1",
    gradeWeightName: "Assignments",
    gradeWeightPercentage: 50,
    percentageGrade: 85,
    sessionStart: new Date("2024-01-01"),
    sessionEnd: new Date("2024-06-01"),
    isCourseCompleted: true,
    courseName: "Test Course",
    courseCode: "TEST101",
    studentId: "student-1",
    studentFirstName: "John",
    studentLastName: "Doe",
    studentGender: "male",
    studentDob: new Date("2000-01-01"),
  },
  {
    academicTaskId: "assignment-1",
    academicTaskName: "Assignment 1",
    academicTaskType: "assignment",
    courseSessionId: "course-session-1",
    gradeWeightId: "weight-1",
    gradeWeightName: "Assignments",
    gradeWeightPercentage: 50,
    percentageGrade: 20,
    sessionStart: new Date("2024-01-01"),
    sessionEnd: new Date("2024-06-01"),
    isCourseCompleted: true,
    courseName: "Test Course",
    courseCode: "TEST101",
    studentId: "student-2",
    studentFirstName: "Jane",
    studentLastName: "Smith",
    studentGender: "female",
    studentDob: new Date("2000-02-01"),
  },
]);
describe("Assignment Overview API", () => {
  test("returns unsuccessful response when user is not authenticated", async () => {
    serverSessionMock.mockResolvedValue(null);
    const res = await apiGetAssignmentsOverview("course-session-1");
    expect(res.success).toBe(false);
    expect(res.message).toBe("Unauthorized");
  });
  test("returns unsuccessful response when user has insufficient permissions", async () => {
    serverSessionMock.mockResolvedValue({
      user: { id: "user-1", role: "student" },
    });
    const res = await apiGetAssignmentsOverview("course-session-1");
    expect(res.success).toBe(false);
    expect(res.message).toBe("Forbidden: Insufficient permissions");
  });
  test("returns aggregated assignment data for authorized users", async () => {
    serverSessionMock.mockResolvedValue({
      user: { id: "user-2", role: "teacher" },
    });
    const res = await apiGetAssignmentsOverview("course-session-1");
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.length).toBe(2);
    expect(res.data?.[0].assignments).toBeDefined();
    expect(res.data?.[1].assignments).toBeDefined();
  });
});
