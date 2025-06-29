export const CourseSessionsNavToolbar = ({ isAdmin }: { isAdmin: boolean }) => {
  if (isAdmin) return null;
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start">
        <li>
          <a
            href={`/dashboard/student/grades`}
            className="text-white hover:text-gray-300 self-start"
          >
            Grades
          </a>
        </li>
      </ul>
    </div>
  );
};
