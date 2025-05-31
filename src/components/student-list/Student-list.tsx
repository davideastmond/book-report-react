"use client";
import { EnrolledStudent } from "@/lib/types/db/course-session-info";

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
  return (
    <table className="table-auto w-full">
      <thead className="text-left">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>DOB</th>
        </tr>
      </thead>
      <tbody className="">
        {students.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center text-gray-500">
              No data
            </td>
          </tr>
        )}
        {students?.map((student, index) => (
          <tr
            key={student.studentId}
            className={`${
              linkable && "hover:cursor-pointer "
            } hover:bg-list-hover/20 ${
              index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
            }`}
            onClick={() => handleStudentClick(student.studentId)}
          >
            <td>
              {student.studentLastName} {student.studentFirstName?.slice(0, 1)}
            </td>
            <td>{student.studentEmail}</td>
            <td>{new Date(student.studentDob!).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
