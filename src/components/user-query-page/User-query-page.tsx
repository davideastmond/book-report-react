"use client";
import { UserClient } from "@/clients/user-client";
import {
  CourseHistoryData,
  UserSummaryData,
} from "@/lib/types/admin-data/admin-student-data-api-response";
import { GradeSummaryData } from "@/lib/types/grading/student/definitions";
import { useCallback, useState } from "react";
import { Spinner } from "../spinner/Spinner";
import { UserSearch } from "../user-search/User-Search";

export function UserQueryPage() {
  const [studentInfo, setStudentInfo] = useState<UserSummaryData | null>(null);
  const [courseHistoryInfo, setCourseHistoryInfo] = useState<
    CourseHistoryData[] | null
  >(null);
  const [gradeSummaryData, setGradeSummaryData] = useState<
    GradeSummaryData[] | null
  >(null);

  const [isBusy, setIsBusy] = useState(false);
  const handleUserSelected = async (userId: string) => {
    // Handle user selection
    await fetchData(userId);
  };

  const fetchData = async (userId: string) => {
    setIsBusy(true);
    try {
      const data = await UserClient.getAdminUserData(userId);
      setStudentInfo(data.studentData);
      setCourseHistoryInfo(data.coursesData);
      setGradeSummaryData(data.gradesData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const getFinalGrade = useCallback(
    (courseSessionId: string) => {
      if (!gradeSummaryData) return "N/A";

      const foundData = gradeSummaryData.find(
        (entry) => entry.courseSessionId === courseSessionId
      );

      if (!foundData) return "N/A";
      return foundData.coursePercentageAverage?.toFixed(2) as string;
    },
    [gradeSummaryData]
  );

  return (
    <div className="flex flex-col h-full">
      <div>
        <UserSearch onUserSelect={handleUserSelected} />
      </div>

      {isBusy && <Spinner />}
      {/* We want to show details after a student is selected */}
      {studentInfo && (
        <table className="w-full mt-4">
          <thead className="text-left">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {studentInfo ? (
              <tr>
                <td>{studentInfo.studentFirstName}</td>
                <td>{studentInfo.studentLastName}</td>
                <td>{studentInfo.studentId}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={3}>No student selected</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* We want to show details after a student is selected */}
      {courseHistoryInfo && (
        <table className="w-full mt-4">
          <thead className="text-left">
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Session ID</th>
              <th>Session Start</th>
              <th>Session End</th>
              <th>Completed</th>
              <th>Final Grade</th>
            </tr>
          </thead>
          <tbody>
            {courseHistoryInfo?.map((course, index) => (
              <tr
                key={course.courseSessionId}
                className={`${
                  index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
                } hover:bg-list-hover/20`}
              >
                <td>{course.courseName}</td>
                <td>{course.courseCode}</td>
                <td>{course.courseSessionId}</td>
                <td>{new Date(course.sessionStart).toLocaleDateString()}</td>
                <td>
                  {new Date(course.sessionEnd.toString()).toLocaleDateString()}
                </td>
                <td>{course.isCompleted ? "Yes" : "No"}</td>
                <td
                  className={getGradeCSS(getFinalGrade(course.courseSessionId))}
                >
                  {getFinalGrade(course.courseSessionId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function getGradeCSS(input: number | string): string {
  const baseCssClass = "font-thin ";
  const grade = parseFloat(input as string);
  if (isNaN(grade)) {
    return baseCssClass;
  }

  if (grade >= 80) return baseCssClass + "text-green-500";
  if (grade >= 70) return baseCssClass + "text-orange-500";
  return baseCssClass + "text-red-500";
}
