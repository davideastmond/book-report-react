"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { TaskType } from "@/lib/types/course-work/task-type";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { newCourseWorkValidator } from "@/lib/validators/course-work/new-course-work-validator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

type FormFields = "name" | "description" | "taskType" | "dueDate";

export function CourseWorkCreateForm({
  courseSessionId,
}: {
  courseSessionId: string;
}) {
  const [formErrors, setFormErrors] = useState<
    Record<FormFields, string | null>
  >({
    name: null,
    description: null,
    taskType: null,
    dueDate: null,
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [courseSessionInfo, setCourseSessionInfo] =
    useState<CourseSessionInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load course session data when the component mounts
    // This helps to give context to the form, such as the course name
    loadCourseSessionData();
  }, []);

  async function loadCourseSessionData() {
    const data = await CourseSessionClient.fetchCourseSessionByIdAdmin(
      courseSessionId
    );
    setCourseSessionInfo(data.courseSessionData);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    clearFormErrors();
    try {
      newCourseWorkValidator.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setFormErrors((prev) => ({
            ...prev,
            [err.path[0]]: err.message,
          }));
        });
      }
      console.error("Error parsing form data:", error);
      return;
    }
    // Send the data
    try {
      await CourseWorkClient.createCourseWork({
        courseSessionId: courseSessionId,
        data,
      });
      // Redirect to the course work page after successful creation
      router.push(
        `/dashboard/courses-sessions/${courseSessionId}/admin/course-work`
      );
    } catch (error) {
      console.error("Error creating course work:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unknown error occurred while creating course work.");
      }
    }
  };

  const clearFormErrors = () => {
    setFormErrors({
      name: null,
      description: null,
      taskType: null,
      dueDate: null,
    });
  };
  return (
    <div className="p-4">
      {courseSessionInfo && (
        <h2>
          {new Date(courseSessionInfo.sessionStart!).toLocaleDateString()}
          <br />
          {courseSessionInfo.courseCode} - {courseSessionInfo.courseName}
        </h2>
      )}
      <h1 className="text-2xl text-center mb-4 font-bold">
        Create Academic Task
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">* Title:</label>
          <div>
            <input
              maxLength={200}
              type="text"
              name="name"
              id="name"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="taskType">* Course</label>
            <select
              className="border rounded p-2 mb-4 w-full"
              name="courseId"
              id="courseId"
            >
              {Object.values(TaskType).map((taskType) => (
                <option
                  className="bg-amber-background"
                  key={taskType}
                  value={taskType}
                >
                  {taskType}
                </option>
              ))}
            </select>
            {formErrors.taskType && (
              <p className="text-red-500 text-sm">{formErrors.taskType}</p>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="description">Description:</label>
            <div>
              <textarea
                id="description"
                name="description"
                className="w-full p-2"
                autoComplete="off"
                rows={4}
                placeholder="Description academic task"
                maxLength={1000}
              ></textarea>
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="dueDate">Due Date:</label>
            <div>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="w-full p-2"
                autoComplete="off"
                data-lpignore="true"
                onKeyDown={() => false}
                required
              ></input>
              {formErrors.dueDate && (
                <p className="text-red-500 text-sm">{formErrors.dueDate}</p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="flatStyle inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Course Work
        </button>
        <div>
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
        </div>
      </form>
    </div>
  );
}
