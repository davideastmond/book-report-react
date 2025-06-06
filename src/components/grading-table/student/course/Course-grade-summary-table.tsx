/* 
The responsibility of this component is to display a table for a course, with the grade summary
*/

import { GradeSummaryData } from "@/lib/types/grading/definitions";
import { isParsable } from "@/lib/utils/parsing/is-parsable";

export function CourseGradeSummaryTable({
  gradeSummaryData,
}: {
  gradeSummaryData: GradeSummaryData;
}) {
  const calculatePercentageGrade = (): string | number => {
    const numericParsable = isParsable(
      gradeSummaryData.coursePercentageAverage as string
    );
    const letterParsable = isParsable(
      gradeSummaryData.courseLetterGradeAverage as string
    );

    if (!numericParsable && !letterParsable) {
      return "N/A";
    }
    if (numericParsable && letterParsable) {
      return (
        parseFloat(gradeSummaryData.coursePercentageAverage as string).toFixed(
          1
        ) +
        parseFloat(gradeSummaryData.courseLetterGradeAverage as string) / 2
      );
    }

    return numericParsable
      ? parseFloat(gradeSummaryData.coursePercentageAverage as string).toFixed(
          1
        )
      : parseFloat(gradeSummaryData.courseLetterGradeAverage as string);
  };
  return (
    <table className="table-fixed w-full">
      <thead className="text-left min-w-[200px]">
        <tr className="border bg-slate-400/10">
          <th>Course Code</th>
          <th>Course Name</th>
          <th>Session Start</th>
          <th>Session End</th>
          <th>Student Name</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{gradeSummaryData.courseCode}</td>
          <td>{gradeSummaryData.courseName}</td>
          <td>
            {new Date(gradeSummaryData.sessionStart!).toLocaleDateString()}
          </td>
          <td>{new Date(gradeSummaryData.sessionEnd!).toLocaleDateString()}</td>
          <td>
            {gradeSummaryData.studentLastName}{" "}
            {gradeSummaryData.studentFirstName?.slice(0, 1)}
          </td>
          <td>{calculatePercentageGrade()}</td>
        </tr>
      </tbody>
    </table>
  );
}
