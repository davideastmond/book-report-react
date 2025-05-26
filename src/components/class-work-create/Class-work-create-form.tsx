"use client";

import { TaskType } from "@/lib/types/course-work/task-type";
import { useState } from "react";

type FormFields = "name" | "description" | "taskType" | "dueDate";

export function ClassWorkCreateForm() {
  const [formErrors, setFormErrors] = useState<
    Record<FormFields, string | null>
  >({
    name: null,
    description: null,
    taskType: null,
    dueDate: null,
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {};
  return (
    <div className="p-4">
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
            <label htmlFor="description">* Description:</label>
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
      </form>
    </div>
  );
}
