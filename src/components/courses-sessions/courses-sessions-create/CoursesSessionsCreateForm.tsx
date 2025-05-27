"use client";
import { CourseClient } from "@/clients/course-client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { Course } from "@/db/schema";
import { createCourseSessionValidator } from "@/lib/validators/course-session/create-course-session-validator";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import z from "zod";
export function CoursesSessionsCreateForm() {
  const [courses, setCourses] = useState<Partial<Course>[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({
    courseId: null,
    sessionStart: null,
    sessionEnd: null,
    description: null,
    studentAllotment: null,
  });
  const router = useRouter();
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
    clearFormErrors();
    try {
      createCourseSessionValidator.parse(data);
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
    try {
      await CourseSessionClient.createCourseSession(data);
      router.push("/dashboard/courses-sessions");
    } catch (error) {
      console.error("Error creating course:", (error as Error).message);
    }
  }
  const clearFormErrors = () => {
    setFormErrors({
      courseId: null,
      sessionStart: null,
      sessionEnd: null,
      description: null,
      studentAllotment: null,
    });
  };
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
          {formErrors.courseId && (
            <p className="text-red-500 text-sm">{formErrors.courseId}</p>
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
              placeholder="Description of the class session"
              maxLength={500}
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-sm">{formErrors.description}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="studentAllotment">Stu. Allot.:</label>
          <div>
            <input
              type="number"
              id="studentAllotment"
              name="studentAllotment"
              placeholder="20"
              min={1}
              max={250}
              className="w-full p-2"
              autoComplete="off"
              data-lpignore="true"
              onKeyDown={() => false} // Todo, validate
            ></input>
            {formErrors.studentAllotment && (
              <p className="text-red-500 text-sm">
                {formErrors.studentAllotment}
              </p>
            )}
          </div>
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
            {formErrors.sessionStart && (
              <p className="text-red-500 text-sm">{formErrors.sessionStart}</p>
            )}
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
            {formErrors.sessionEnd && (
              <p className="text-red-500 text-sm">{formErrors.sessionEnd}</p>
            )}
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
