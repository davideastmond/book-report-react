import { EnrolledStudent } from "@/lib/types/db/course-session-info";
import { GradeData, TableData } from "@/lib/types/grading/student/definitions";
import { ChangeEvent } from "react";

type GradingTableProps = {
  students: EnrolledStudent[];
  courseWorkId?: string | null; // Optional prop for course work ID
  tableData: TableData;
  onTableDataChange?: ({
    data,
    studentId,
    courseWorkId,
  }: {
    data: Record<string, number | string>;
    studentId: string;
    courseWorkId: string;
  }) => void;
  disabled?: boolean; // Optional prop to disable the table
};

type TableDataChangeEvent<T> = {
  event: ChangeEvent<T>;
  studentId: string;
  courseWorkId: string;
};

export function GradingTable({
  students,
  courseWorkId,
  tableData,
  onTableDataChange,
  disabled,
}: GradingTableProps) {
  function handleTableDataChange<T>({
    event,
    studentId,
    courseWorkId,
  }: TableDataChangeEvent<T>) {
    // Here we have format the value from the input fields
    const value = (
      event as ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ).target.value;
    const name = (
      event as ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ).target.name;

    if (onTableDataChange) {
      onTableDataChange({
        data: { [name]: value },
        studentId,
        courseWorkId,
      });
    }
  }

  return (
    <table className="table-auto w-full">
      <thead className="text-left">
        <tr>
          <th className="border border-gray-300 p-2">Student</th>
          <th className="border border-gray-300 p-2">DOB</th>
          <th className="border border-gray-300 p-2">N. Grade</th>
          <th className="border border-gray-300 p-2">Ins. Feedback</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr
            key={student.studentId}
            className={`${
              index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
            } hover:bg-list-hover/20`}
          >
            <td className="border border-gray-300 p-2">
              {student.studentLastName} {student.studentFirstName}
            </td>
            <td className="border border-gray-300 p-2">
              {new Date(student.studentDob!).toLocaleDateString()}
            </td>
            <td className="border border-gray-300 p-2">
              <input
                type="number"
                min={0}
                name="percentageGrade"
                className="text-sky-500 appearance-none"
                disabled={disabled}
                onChange={(event) =>
                  handleTableDataChange({
                    event,
                    studentId: student.studentId,
                    courseWorkId: courseWorkId!,
                  })
                }
                value={
                  extractData({
                    studentId: student.studentId,
                    courseWorkId: courseWorkId!,
                    tableData,
                  })?.percentageGrade || 0
                }
              />
            </td>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                className="w-full"
                name="instructorFeedback"
                maxLength={500}
                disabled={disabled}
                onChange={(event) =>
                  handleTableDataChange({
                    event,
                    studentId: student.studentId,
                    courseWorkId: courseWorkId!,
                  })
                }
                value={
                  extractData({
                    studentId: student.studentId,
                    courseWorkId: courseWorkId!,
                    tableData,
                  })?.instructorFeedback || ""
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function extractData({
  studentId,
  courseWorkId,
  tableData,
}: {
  studentId: string;
  courseWorkId: string;
  tableData: TableData;
}) {
  const courseWorkData = tableData[courseWorkId];
  if (courseWorkData) {
    const studentData: GradeData | undefined = courseWorkData[studentId];
    if (studentData) {
      return studentData || "";
    }
  }
}
