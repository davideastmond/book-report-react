import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { JSX } from "react";

type GroupedCourseTableProps = {
  groupedCourses: GroupedCourseInfo[];
};
type GroupedCourseId = string;

export function GroupedCourseTable({
  groupedCourses,
}: GroupedCourseTableProps) {
  const router = useRouter();

  return renderTable(groupedCourses, router) || null;
}

function renderTable(
  data: GroupedCourseInfo[],
  router: AppRouterInstance
): JSX.Element[] | null {
  if (!data || data.length === 0) return null;
  const groupedData: Record<GroupedCourseId, GroupedCourseInfo[]> = {};
  data.forEach((item) => {
    if (!groupedData[item.courseId!]) {
      groupedData[item.courseId!] = [];
    }
    groupedData[item.courseId!].push(item);
  });

  return Object.entries(groupedData).map(([courseId, sessions]) => (
    <div className="my-10" key={courseId}>
      <h2 className="underline font-bold">
        {sessions[0].courseCode} - {sessions[0].courseName}
      </h2>
      <table className="table-auto w-full">
        <thead className="text-left">
          <tr>
            <th>SessionId</th>
            <th>Instructor</th>
            <th>Session Dates</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr
              key={session.courseSessionId}
              className={`${"hover:cursor-pointer "} hover:bg-list-hover/20 ${
                index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
              }`}
              onClick={() =>
                router.push(`/dashboard/admin/${session.courseSessionId}/stats`)
              }
            >
              <td className="p-2">{session.courseSessionId}</td>
              <td className="p-2">
                {session.courseSessionInstructorLastName}{" "}
                {session.courseSessionInstructorFirstName?.slice(0, 1)}.
              </td>
              <td className="p-2">
                {new Date(session.courseSessionStart!).toLocaleDateString()} -{" "}
                {new Date(session.courseSessionEnd!).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));
}
