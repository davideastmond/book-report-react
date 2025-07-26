import { CourseSessionClient } from "@/clients/course-session-client";
import { AggregatedCourseAssignmentData } from "@/lib/controller/grades/aggregators/definitions";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AssignmentsOverview } from "./Assignments-overview";

vi.mock("ag-charts-react", () => ({
  AgCharts: vi.fn(() => null),
}));
const fetchSpy = vi
  .spyOn(CourseSessionClient, "getAssignmentsOverview")
  .mockResolvedValue([
    {
      studentFirstName: "John",
      studentLastName: "Doe",
      assignments: [
        {
          academicTaskName: "Math Assignment",
          grade: 85,
          academicTaskId: null,
          academicTaskType: null,
        },
        {
          academicTaskName: "Science Assignment",
          grade: 90,
          academicTaskId: null,
          academicTaskType: null,
        },
      ],
    },
    {
      studentFirstName: "Jane",
      studentLastName: "Smith",
      assignments: [
        {
          academicTaskName: "Math Assignment",
          grade: 95,
          academicTaskId: null,
          academicTaskType: null,
        },
        {
          academicTaskName: "Science Assignment",
          grade: 88,
          academicTaskId: null,
          academicTaskType: null,
        },
      ],
    },
  ] as AggregatedCourseAssignmentData[]);

describe("Assignments Overview Component Tests", () => {
  it("calls CourseSessionClient.getAssignmentsOverview on mount", () => {
    render(<AssignmentsOverview courseSessionId="course-session-id" />);
    expect(fetchSpy).toHaveBeenCalledWith("course-session-id");
  });
});
