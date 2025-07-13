import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { AcademicGrade } from "@/db/schema";
import { AcademicTaskWithWeighting } from "@/lib/types/course-work/definitions";
import { CourseSessionDataAPIResponse } from "@/lib/types/db/course-session-info";
import { TableData } from "@/lib/types/grading/student/definitions";
import { useAdmin } from "app/hooks/use-admin";
import { useToast } from "app/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GradingTable } from "../grading-table/Grading-table";
import { Spinner } from "../spinner/Spinner";

// This is the main component rendered in the course grading page.
export function CourseGradingMain({
  courseData,
}: {
  courseData: CourseSessionDataAPIResponse;
}) {
  const [courseWork, setCourseWork] = useState<AcademicTaskWithWeighting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCourseWorkId, setSelectedCourseWorkId] = useState<
    string | null
  >(null);
  const [tableData, setTableData] = useState<TableData>({});

  const params = useParams<{ courseSessionId: string }>();

  const { isAdminEditable } = useAdmin(
    courseData.courseSessionData.courseSessionId as string
  );

  const { showToast, ToastElement } = useToast();
  useEffect(() => {
    fetchCourseWork(true);
  }, []);

  useEffect(() => {
    fetchCourseGrades();
  }, []);

  async function fetchCourseGrades() {
    const courseSessionGrades =
      await CourseSessionClient.fetchGradesForCourseSession(
        courseData.courseSessionData.courseSessionId as string
      );

    setTableData(convertToTableData(courseSessionGrades));
  }

  async function fetchCourseWork(assignSelected: boolean) {
    const courseWork = await CourseWorkClient.getCourseWorkForSession(
      courseData.courseSessionData.courseSessionId as string
    );
    setCourseWork(courseWork);
    // If there is courseWork and assignSelected is true, set the first assignment as selected
    if (courseWork.length > 0 && assignSelected) {
      setSelectedCourseWorkId(courseWork[0].id as string); // Set the first work as selected by default
    }
  }

  const handleSelectedWorkChange = (workId: string) => {
    setSelectedCourseWorkId(workId);
  };

  async function handleSubmitGradeUpdates() {
    if (Object.keys(tableData).length === 0) {
      console.info("No grade updates to submit.");
      return;
    }
    try {
      setIsLoading(true);
      await CourseSessionClient.submitGradeUpdatesForCourseSession({
        courseSessionId: params.courseSessionId,
        data: tableData,
      });
      //At some point, you might want to fetch the updated grades again
      showToast("Grade updates submitted successfully.");
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error submitting grade updates:",
        (error as Error).message
      );
    }
  }

  const convertToTableData = (data: AcademicGrade[]): TableData => {
    const transformedData: TableData = {};
    data.forEach((grade) => {
      const { academicTaskId, userId, ...gradeData } = grade;
      if (!transformedData[academicTaskId]) {
        transformedData[academicTaskId] = {};
      }
      transformedData[academicTaskId][userId] = gradeData;
    });
    return transformedData;
  };

  const handleTableDataChange = ({
    data,
    studentId,
    courseWorkId,
  }: {
    data: Record<string, object | string | number | boolean>;
    studentId: string;
    courseWorkId: string;
  }) => {
    setTableData((prev) => {
      const updatedData = { ...prev };
      if (!updatedData[courseWorkId]) {
        updatedData[courseWorkId] = {};
      }
      updatedData[courseWorkId][studentId] = {
        ...updatedData[courseWorkId][studentId],
        ...data,
      };
      return updatedData;
    });
  };

  return (
    <div>
      <section className="text-xl mb-4 font-thin mt-4">
        <p>
          {courseData.courseSessionData.courseCode} -{" "}
          {courseData.courseSessionData.courseName}
        </p>
        <p>
          Instructor: {courseData.courseSessionData.instructorLastName}{" "}
          {courseData.courseSessionData.instructorFirstName.slice(0, 1)}
        </p>
      </section>
      <section>
        <h2 className="text-xl">Assignments:</h2>
        {!courseWork && (
          <p className="text-red-500">No assignments for this course.</p>
        )}
        <select
          className="border rounded p-2 mb-4 w-full"
          name="courseId"
          id="courseId"
          onChange={(e) => handleSelectedWorkChange(e.target.value)}
          disabled={!isAdminEditable}
        >
          {courseWork.map((work) => (
            <option
              className="bg-amber-background"
              key={work.id}
              value={work.id}
            >
              {work.name} - {work.taskType} - Due:{" "}
              {new Date(work.dueDate!).toLocaleDateString()}
            </option>
          ))}
        </select>
      </section>
      {courseData.courseSessionData.isCompleted && (
        <p className="text-amber-300 my-4">Course session completed.</p>
      )}
      <section className="flex justify-end my-4 px-2">
        {courseData.students && courseData.students.length > 0 ? (
          <button
            className="flatStyle bg-green-950"
            onClick={handleSubmitGradeUpdates}
            disabled={
              isLoading ||
              !isAdminEditable ||
              courseData.courseSessionData.isCompleted
            }
          >
            <span className="flex items-center gap-2">
              {isLoading && <Spinner />}
              Update Grades
            </span>
          </button>
        ) : (
          <button disabled>No students to grade.</button>
        )}
      </section>
      <section>
        <ToastElement />
      </section>
      <section>
        {/* The grading table component goes here */}
        <GradingTable
          students={courseData.students}
          courseWorkId={selectedCourseWorkId}
          tableData={tableData}
          onTableDataChange={handleTableDataChange}
          disabled={
            !isAdminEditable || courseData.courseSessionData.isCompleted
          }
        />
      </section>
    </div>
  );
}
