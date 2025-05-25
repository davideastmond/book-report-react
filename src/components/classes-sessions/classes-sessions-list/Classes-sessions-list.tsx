"use client";
import { CourseSessionsAPIResponse } from "@/lib/types/db/course-session-info";
import { useRouter } from "next/navigation";

type ClassesSessionsListProps = {
  classesSessions?: CourseSessionsAPIResponse;
  linkable?: boolean;
  enrolled?: {
    show: boolean;
    count: number;
  };
};
export function ClassesSessionsList({
  classesSessions,
  linkable,
  enrolled,
}: ClassesSessionsListProps) {
  const router = useRouter();

  return (
    <table className="table-auto w-full">
      <thead className="text-left">
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Instructor Name</th>
          <th>Session Start</th>
          <th>Session End</th>
          <th>Allotment</th>
          {enrolled && enrolled.show && <th>Enrolled</th>}
        </tr>
      </thead>
      <tbody className="">
        {classesSessions?.map((session, index) => (
          <tr
            key={session.courseSessionId}
            className={`${
              linkable && "hover:cursor-pointer "
            } hover:bg-list-hover/20 ${
              index % 2 === 0 ? "bg-slate-400/10" : "bg-background"
            }`}
            onClick={() => {
              if (!linkable) return;
              router.push(
                `/dashboard/classes-sessions/view?id=${session.courseSessionId}`
              );
            }}
          >
            <td>{session.courseCode}</td>
            <td>{session.courseName}</td>
            <td>
              {session.instructorLastName}{" "}
              {session.instructorFirstName?.slice(0, 1)}
            </td>
            <td>{new Date(session.sessionStart!).toLocaleDateString()}</td>
            <td>{new Date(session.sessionEnd!).toLocaleDateString()}</td>
            <td>{session.studentAllotment}</td>
            {enrolled && enrolled.show && <td>{enrolled.count}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
