"use client";
import { UserClient } from "@/clients/user-client";
import {
  CourseHistoryData,
  UserSummaryData,
} from "@/lib/types/admin-data/admin-student-data-api-response";
import { GradeSummaryData } from "@/lib/types/grading/student/definitions";
import { Card, CardBody } from "@heroui/react";
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
      {studentInfo ? (
        <Card>
          <CardBody>
            <p className="font-bold">
              StudentId:
              <span className="font-thin">{studentInfo.studentId}</span>
            </p>
            <p className="font-bold">
              Student Name:
              <span>
                {studentInfo.studentLastName}, {studentInfo.studentFirstName}
              </span>
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <p className="text-center">No student selected</p>
          </CardBody>
        </Card>
      )}
      {/* We want to show details after a student is selected */}
      {courseHistoryInfo?.map((course, index) => (
        <Card
          key={course.courseSessionId}
          className={`${
            index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
          } hover:bg-list-hover/20`}
        >
          <CardBody>
            <p className="font-bold">
              Course Name:
              <span className="font-thin">{course.courseName}</span>
            </p>
            <p className="font-bold">
              Course Code:
              <span className="font-thin">{course.courseCode}</span>
            </p>
            <p className="font-bold">
              Session ID:
              <span className="font-thin">{course.courseSessionId}</span>
            </p>
            <p className="font-bold">
              Session Start:
              <span className="font-thin">
                {new Date(course.sessionStart).toLocaleDateString()}
              </span>
            </p>
            <p className="font-bold">
              Session End:
              <span className="font-thin">
                {new Date(course.sessionEnd.toString()).toLocaleDateString()}
              </span>
            </p>
            <p className="font-bold">
              Completed:
              <span className="font-thin">
                {course.isCompleted ? "Yes" : "No"}
              </span>
            </p>
            <p className="font-bold">
              Final Grade:
              <span
                className={getGradeCSS(getFinalGrade(course.courseSessionId))}
              >
                {getFinalGrade(course.courseSessionId)}
              </span>
            </p>
          </CardBody>
        </Card>
      ))}
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
