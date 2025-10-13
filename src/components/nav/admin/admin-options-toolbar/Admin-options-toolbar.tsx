import Link from "next/link";

export function AdminOptionsToolbar() {
  return (
    <div className="bg-green-900 p-1 text-sm">
      <ul className="flex justify-start gap-12">
        <li>
          <Link
            href={`/dashboard/admin/completed-courses-summary`}
            className="text-white hover:text-gray-300"
          >
            Completed Courses Summary
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/admin/student-query`}
            className="text-white hover:text-gray-300"
          >
            Student Query
          </Link>
        </li>
      </ul>
    </div>
  );
}
