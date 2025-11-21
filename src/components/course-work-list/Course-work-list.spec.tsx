import { TaskType } from "@/lib/types/course-work/task-type";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseWorkList } from "./Course-work-list";

const dummyTaskData = [
  {
    id: "task1",
    name: "Task 1",
    description: "Desc. for Task1",
    gradeWeightPercentage: 50,
    gradeWeightId: "weight1",
    gradeWeightName: "Midterm",
    taskType: "assignment" as TaskType,
    dueDate: new Date("2025-10-01"),
    courseSessionId: "session1",
  },
  {
    id: "task2",
    name: "Task 2",
    description: "Desc. for Task2",
    gradeWeightPercentage: 20,
    gradeWeightId: "weight2",
    gradeWeightName: "gw1",
    taskType: "exam" as TaskType,
    dueDate: new Date("2025-10-01"),
    courseSessionId: "session1",
  },
  {
    id: "task3",
    name: "Task 3",
    description: "Desc. for Task3",
    gradeWeightPercentage: 30,
    gradeWeightId: "weight3",
    gradeWeightName: "gw2",
    taskType: "other" as TaskType,
    dueDate: new Date("2025-11-01"),
    courseSessionId: "session1",
  },
];
describe("CourseWorkList", () => {
  it("if linkable, it renders a table with course work items", async () => {
    const { getByText } = render(
      <CourseWorkList linkable={true} courseWork={dummyTaskData} />
    );
    [/task 1/i, /task 2/i, /task 3/i].forEach((text) => {
      const element = getByText(text);
      expect(element).toBeDefined();
    });

    [/midterm/i, /gw1/i, /gw2/i].forEach((text) => {
      const element = getByText(text);
      expect(element).toBeDefined();
    });
  });

  it("when the list is linkable, the router is called with the correct path", async () => {
    const { getByRole } = render(
      <CourseWorkList linkable={true} courseWork={dummyTaskData} />
    );

    const result = getByRole("link", { name: /task 1/i });
    expect(result).toBeDefined();
  });
});
