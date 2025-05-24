"use client";
import { CourseClient } from "@/clients/course-client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { Course } from "@/db/schema";

import { useEffect, useState } from "react";
export function ClassesSessionsCreateForm() {
  const [courses, setCourses] = useState<Partial<Course>[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const courses = await CourseClient.fetchCourses();
    setCourses(courses);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await CourseSessionClient.createCourseSession(data);
      console.log("Course created successfully");
    } catch (error) {
      console.error("Error creating course:", (error as Error).message);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center mb-4 font-bold">
        Create Class Session
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="course_id">* Course</label>
          <select
            className="border rounded p-2 mb-4 w-full"
            name="courseId"
            id="courseId"
          >
            {courses.map((course) => (
              <option
                className="bg-amber-background"
                key={course.id}
                value={course.id}
              >
                {course.course_code}-{course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="sessionStart">* Starts:</label>
          <div>
            <input
              type="date"
              id="sessionStart"
              name="sessionStart"
              className="w-full p-2"
              autoComplete="off"
              data-lpignore="true"
              onKeyDown={() => false}
              required
            ></input>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="session_end">* Ends:</label>
          <div>
            <input
              type="date"
              id="sessionEnd"
              name="sessionEnd"
              className="w-full p-2"
              autoComplete="off"
              data-lpignore="true"
              required
              onKeyDown={() => false}
            ></input>
          </div>
        </div>
        <button
          type="submit"
          className="flatStyle inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Class Session
        </button>
      </form>
    </div>
  );
}
