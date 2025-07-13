export function AdminOptionsToolbar() {
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start gap-12">
        <li>
          <a
            href={`/dashboard/admin/completed-courses-summary`}
            className="text-white hover:text-gray-300"
          >
            Completed Courses Summary
          </a>
        </li>
        <li>
          <a
            href={`/dashboard/admin/student-query`}
            className="text-white hover:text-gray-300"
          >
            Student Query
          </a>
        </li>
      </ul>
    </div>
  );
}
