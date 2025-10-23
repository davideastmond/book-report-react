import { EnrolledStudent } from "@/lib/types/db/course-session-info";
import { Card, CardBody } from "@heroui/react";
type StudentListProps = {
  linkable?: boolean;
  students: EnrolledStudent[];
  onStudentClick?: (studentId: string) => void;
  suppressLink?: boolean;
  disabled?: boolean;
};
export function StudentList({
  students,
  linkable,
  onStudentClick,
  suppressLink,
  disabled = false,
}: StudentListProps) {
  const handleStudentClick = (studentId: string) => {
    if (disabled) return;
    if (onStudentClick) {
      onStudentClick(studentId);
    }
    if (suppressLink) return;
  };

  if (!students || students.length === 0) {
    return <p data-testid="no-data-message">No data</p>;
  }
  return (
    <div className="flex flex-wrap gap-6">
      {students?.map((student) => (
        <Card
          data-testid="user-search-results"
          className={`bg-gray-900 p-3 rounded-md mb-2 w-full ${
            linkable ? "cursor-pointer hover:bg-gray-800" : ""
          }`}
          key={student.studentId}
        >
          <CardBody onClick={() => handleStudentClick(student.studentId)}>
            <p>
              <span className="font-bold">Student Name: </span>
              <span>
                {student.studentLastName}
                {", "}
                {student.studentFirstName?.slice(0, 1)}
              </span>
            </p>
            <p>
              <span className="font-bold">Email: </span>
              <span>{student.studentEmail}</span>
            </p>
            <p>
              <span className="font-bold">DOB: </span>
              <span>{new Date(student.studentDob!).toLocaleDateString()}</span>
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
