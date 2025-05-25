export const CourseSessionsNavToolbar = () => {
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-around">
        <li>
          <a
            href="/dashboard/course-work"
            className="text-white hover:text-gray-300"
          >
            Exams and Course Work
          </a>
        </li>
        <li>
          <a
            href="/dashboard/grading"
            className="text-white hover:text-gray-300"
          >
            Grading
          </a>
        </li>
      </ul>
    </div>
  );
};
