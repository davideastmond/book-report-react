import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { AcademicGrade, AcademicTask } from "@/db/schema";
import { CourseSessionDataAPIResponse } from "@/lib/types/db/course-session-info";
import { TableData } from "@/lib/types/grading/definitions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GradingTable } from "../grading-table/Grading-table";

// This is the main component rendered in the course grading page.
export function CourseGradingMain({
  courseData,
}: {
  courseData: CourseSessionDataAPIResponse;
}) {
  const [courseWork, setCourseWork] = useState<AcademicTask[]>([]);
  const [selectedCourseWorkId, setSelectedCourseWorkId] = useState<
    string | null
  >(null);
  const [tableData, setTableData] = useState<TableData>({});

  const params = useParams<{ courseSessionId: string }>();
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

    const convertedTableData = convertToTableData(courseSessionGrades);
    setTableData(convertedTableData);
  }

  async function fetchCourseWork(assignSelected: boolean = false) {
    const courseWork = await CourseWorkClient.getCourseWorkForSession(
      courseData.courseSessionData.courseSessionId as string
    );
    setCourseWork(courseWork);
    // If there is courseWork and assignSelected is true, set the first assignment as selected
    if (courseWork.length > 0 && assignSelected) {
      setSelectedCourseWorkId(courseWork[0].id); // Set the first work as selected by default
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
      await CourseSessionClient.submitGradeUpdatesForCourseSession({
        courseSessionId: params.courseSessionId,
        data: tableData,
      });
      //At some point, you might want to fetch the updated grades again
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
      <section className="flex justify-end my-4 px-2">
        {courseData.students && courseData.students.length > 0 ? (
          <button
            className="flatStyle bg-green-950"
            onClick={handleSubmitGradeUpdates}
          >
            Update Grades
          </button>
        ) : (
          <button disabled>No students to grade.</button>
        )}
      </section>
      <section>
        {/* The grading table component goes here */}
        <GradingTable
          students={courseData.students}
          courseWorkId={selectedCourseWorkId}
          tableData={tableData}
          onTableDataChange={handleTableDataChange}
        />
      </section>
    </div>
  );
}
