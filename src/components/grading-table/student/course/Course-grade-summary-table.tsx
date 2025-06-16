/* 
The responsibility of this component is to display a table for a course, with the grade summary
*/

import { GradeSummaryData } from "@/lib/types/grading/definitions";

export function CourseGradeSummaryTable({
  gradeSummaryData,
}: {
  gradeSummaryData: GradeSummaryData;
}) {
  return (
    <table className="table-fixed w-full">
      <thead className="text-left min-w-[200px]">
        <tr className="border bg-slate-400/10">
          <th>Course Code</th>
          <th>Course Name</th>
          <th>Instr.</th>
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
            {gradeSummaryData.instructorLastName}{" "}
            {gradeSummaryData.instructorFirstName?.slice(0, 1)}
          </td>
          <td>
            {new Date(gradeSummaryData.sessionStart!).toLocaleDateString()}
          </td>
          <td>{new Date(gradeSummaryData.sessionEnd!).toLocaleDateString()}</td>
          <td>
            {gradeSummaryData.studentLastName}{" "}
            {gradeSummaryData.studentFirstName?.slice(0, 1)}
          </td>
          <td className="text-blue-500">
            {gradeSummaryData.coursePercentageAverage}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
