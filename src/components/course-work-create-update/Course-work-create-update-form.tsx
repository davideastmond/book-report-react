"use client";

import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { AcademicTask, GradeWeight } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { TaskType } from "@/lib/types/course-work/task-type";
import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { newCourseWorkValidator } from "@/lib/validators/course-work/new-course-work-validator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

type FormFields =
  | "name"
  | "description"
  | "taskType"
  | "dueDate"
  | "gradeWeightId";

type CourseWorkCreateUpdateFormProps = {
  courseSessionId: string;
  courseWorkId?: string;
  isEditing?: boolean;
};

export function CourseWorkCreateUpdateForm({
  courseSessionId,
  courseWorkId,
  isEditing = false,
}: CourseWorkCreateUpdateFormProps) {
  const [formErrors, setFormErrors] = useState<
    Record<FormFields, string | null>
  >({
    name: null,
    description: null,
    taskType: null,
    dueDate: null,
    gradeWeightId: null,
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [courseSessionInfo, setCourseSessionInfo] =
    useState<CourseSessionInfo | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [gradeWeightOptions, setGradeWeightOptions] = useState<GradeWeight[]>(
    []
  );
  const { showToast, ToastElement: AttribsUpdatedToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Load course session data when the component mounts
    // This helps to give context to the form, such as the course name
    loadCourseSessionData();
    loadGradeWeightOptions();
  }, []);

  async function loadCourseSessionData() {
    try {
      setIsBusy(true);
      const data = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        courseSessionId
      );
      setCourseSessionInfo(data.courseSessionData);
      if (isEditing && courseWorkId) {
        // If editing, fetch the course work data by ID
        await fetchCourseWorkDataById();
      }
      setIsBusy(false);
    } catch (error) {
      console.error(
        "Error fetching course session data:",
        (error as Error).message
      );
    }
  }

  async function loadGradeWeightOptions() {
    try {
      setIsBusy(true);
      const data = await CourseSessionClient.getCourseWeightings(
        courseSessionId
      );
      setGradeWeightOptions(data);
    } catch (error) {
      console.error("Error fetching grade weight options:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unknown error occurred while fetching grade weights.");
      }
    } finally {
      setIsBusy(false);
    }
  }

  async function fetchCourseWorkDataById() {
    const data = await CourseWorkClient.getCourseWorkById({
      courseSessionId: courseSessionId,
      courseWorkId: courseWorkId as string,
    });

    const nameInputField = document.getElementById("name") as HTMLInputElement;
    const descriptionInputField = document.getElementById(
      "description"
    ) as HTMLTextAreaElement;
    const taskTypeInputField = document.getElementById(
      "taskType"
    ) as HTMLSelectElement;
    const dueDateInputField = document.getElementById(
      "dueDate"
    ) as HTMLInputElement;

    const gradeValueTypeInputField = document.getElementById(
      "gradeValueType"
    ) as HTMLSelectElement;

    const gradeWeightsInput = document.getElementById(
      "gradeWeightId"
    ) as HTMLSelectElement;

    if (gradeValueTypeInputField) {
      gradeValueTypeInputField.value = data.gradeValueType || "p";
    }
    if (nameInputField) {
      nameInputField.value = data.name || "";
    }
    if (descriptionInputField) {
      descriptionInputField.value = data.description || "";
    }
    if (taskTypeInputField) {
      taskTypeInputField.value = data.taskType || "";
    }
    if (dueDateInputField) {
      dueDateInputField.value = data.dueDate
        ? new Date(data.dueDate).toISOString().split("T")[0]
        : "";
    }

    if (gradeWeightsInput) {
      gradeWeightsInput.value = data.gradeWeightId || "";
    }
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
    if (isEditing) {
      // Patch request to update course work
      updateCourseWork(data);
      showToast("Course work attributes updated successfully.");
      return;
    }
    await createCourseWork(data);
  };

  async function createCourseWork(data: Partial<AcademicTask>) {
    // Send the data
    try {
      setIsBusy(true);
      await CourseWorkClient.createCourseWork({
        courseSessionId: courseSessionId,
        data,
      });

      setIsBusy(false);
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
  }

  async function updateCourseWork(data: Partial<AcademicTask>) {
    try {
      setIsBusy(true);
      CourseWorkClient.updateCourseWorkAttributesById(courseWorkId!, data);
      setIsBusy(false);
    } catch (error) {
      console.error("Error updating course work:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unknown error occurred while updating course work.");
      }
    }
  }

  const clearFormErrors = () => {
    setFormErrors({
      name: null,
      description: null,
      taskType: null,
      dueDate: null,
      gradeWeightId: null,
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
        {isEditing ? "Edit Course Work details" : "Create Course Work"}
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
              disabled={isBusy}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="taskType">* Task Type</label>
            <select
              className="border rounded p-2 mb-4 w-full"
              name="taskType"
              id="taskType"
              disabled={isBusy}
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
          <div>
            <label htmlFor="gradeValueType">Grade Value Type</label>
            <select
              className="border rounded p-2 mb-4 w-full"
              name="gradeValueType"
              id="gradeValueType"
              disabled={isBusy}
            >
              <option value="p" className="bg-amber-background">
                Percentage
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="gradeWeightId">* Grade Weight Group</label>
            {gradeWeightOptions.length === 0 && (
              <p className="text-yellow-400">
                You have no grade weights defined. Tap on the grade weightings
                menu option to define some first.
              </p>
            )}
            <select
              className="border rounded p-2 mb-4 w-full"
              name="gradeWeightId"
              id="gradeWeightId"
              disabled={isBusy}
            >
              <option value="" className="bg-amber-background" disabled>
                Select Grade Weight
              </option>
              {/* Options will be populated dynamically */}
              {gradeWeightOptions.map((gw) => (
                <option
                  key={gw.id}
                  value={gw.id}
                  className="bg-amber-background"
                >
                  {gw.name} ({gw.percentage}%)
                </option>
              ))}
            </select>

            {formErrors.gradeWeightId && (
              <p className="text-red-500 text-sm">{formErrors.gradeWeightId}</p>
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
                disabled={isBusy}
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
                disabled={isBusy}
              ></input>
              {formErrors.dueDate && (
                <p className="text-red-500 text-sm">{formErrors.dueDate}</p>
              )}
            </div>
          </div>
        </div>
        <div>{<AttribsUpdatedToast />}</div>
        <button
          type="submit"
          disabled={isBusy}
          className="flatStyle inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? "Update" : "Create Course Work"}
        </button>
        <div>
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
        </div>
      </form>
    </div>
  );
}
