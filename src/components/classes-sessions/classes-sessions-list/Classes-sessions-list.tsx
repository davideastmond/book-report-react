import { CourseSession } from "@/db/schema";

type ClassesSessionsListProps = {
  classesSessions: Partial<CourseSession>[];
};

export function ClassesSessionsList({
  classesSessions,
}: ClassesSessionsListProps) {
  return (
    <table className="table-auto w-full">
      <thead className="text-left">
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Teacher</th>
          <th>Session Start</th>
          <th>Session End</th>
        </tr>
      </thead>
      <tbody className="">
        <tr>
          <td>Math 101</td>
          <td>Session 1</td>
          <td>John Doe</td>
          <td>Jane Smith, Bob Johnson</td>
          <td>Jane Smith, Bob Johnson</td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  );
}
