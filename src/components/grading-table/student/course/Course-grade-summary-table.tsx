/* 
The responsibility of this component is to display a table for a course, with the grade summary
*/

import { GradeSummaryData } from "@/lib/types/grading/student/definitions";
import { Card, CardBody } from "@heroui/react";

export function CourseGradeSummaryTable({
  gradeSummaryData,
}: {
  gradeSummaryData: GradeSummaryData;
}) {
  return (
    <Card>
      <CardBody>
        <p className="font-bold">
          Course:
          <span className="font-thin">
            {gradeSummaryData.courseCode} - {gradeSummaryData.courseName}
          </span>
        </p>
        <p className="font-bold">
          Instructor:
          <span className="font-thin">
            {gradeSummaryData.instructorLastName}{" "}
            {gradeSummaryData.instructorFirstName?.slice(0, 1)}
          </span>
        </p>
        <p className="font-bold">
          Session:
          <span className="font-thin">
            {new Date(gradeSummaryData.sessionStart!).toLocaleDateString()} -{" "}
            {new Date(gradeSummaryData.sessionEnd!).toLocaleDateString()}
          </span>
        </p>
        <p className="font-bold">
          Student:
          <span className="font-thin">
            {gradeSummaryData.studentLastName},{" "}
            {gradeSummaryData.studentFirstName?.slice(0, 1)}
          </span>
        </p>
        <p className="font-bold">
          Grade:
          <span className="text-blue-500">
            {gradeSummaryData.coursePercentageAverage}
          </span>
        </p>
      </CardBody>
    </Card>
  );
}
