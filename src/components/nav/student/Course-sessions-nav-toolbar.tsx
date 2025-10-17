import Link from "next/link";

export const CourseSessionsStudentNavToolbar = () => {
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start">
        <li>
          <Link
            href={`/dashboard/student/grades`}
            className="text-white hover:text-gray-300 self-start"
          >
            Grades
          </Link>
        </li>
      </ul>
    </div>
  );
};
