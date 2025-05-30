export const CourseSessionsNavToolbar = ({
  courseSessionId,
}: {
  courseSessionId: string;
}) => {
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-around">
        <li>
          <a
            href={`/dashboard/courses-sessions/${courseSessionId}/admin/course-work`}
            className="text-white hover:text-gray-300"
          >
            Exams and Course Work
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/courses-sessions/${courseSessionId}/admin/grading`}
            className="text-white hover:text-gray-300"
          >
            Grading
          </a>
        </li>
      </ul>
    </div>
  );
};
