import { EnrolledStudent } from "@/lib/types/db/course-session-info";
import { GradeData, TableData } from "@/lib/types/grading/student/definitions";
import { Card, CardBody } from "@heroui/react";
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
  function handleGradeDataChange<T>({
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
    <div data-testid="grading-container">
      {students.map((student) => (
        <Card
          key={student.studentId}
          className="bg-gray-900 p-3 rounded-md mb-2 w-full"
        >
          <CardBody>
            <p>
              <span className="font-bold">Student Name: </span>
              <span>
                {student.studentLastName.toLocaleUpperCase()}
                {", "}
                {student.studentFirstName?.slice(0, 1).toLocaleUpperCase()}
              </span>
            </p>
            <p>
              <span className="font-bold">DOB: </span>
              {new Date(student.studentDob!).toLocaleDateString()}
            </p>
            <p>
              <span className="font-bold">N. Grade: </span>
              <input
                type="number"
                min={0}
                name="percentageGrade"
                className="text-sky-500 appearance-none border-b border-b-green-50"
                disabled={disabled}
                onChange={(event) =>
                  handleGradeDataChange({
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
            </p>
            <p>
              <span className="font-bold">Ins. Feedback: </span>
              <input
                type="text"
                className="w-full border-b border-b-green-50"
                name="instructorFeedback"
                maxLength={500}
                disabled={disabled}
                onChange={(event) =>
                  handleGradeDataChange({
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
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
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
