import Link from "next/link";

export function GradesNavMain() {
  /* 
  This is the toolbar for the grades section of the student dashboard.
  The overview section can just be a summary of all the courses and the grade for each course that is finished.

  In Course Details, the student can see the details of the course, including the course work, exams, and grades.
  */
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start gap-12">
        <li>
          <Link
            href={`/dashboard/student/grades`}
            className="text-white hover:text-gray-300 self-start"
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/student/grades`}
            className="text-white hover:text-gray-300 self-start"
          >
            Course Details
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/student/grades`}
            className="text-white hover:text-gray-300 self-start"
          >
            Course History
          </Link>
        </li>
      </ul>
    </div>
  );
}
