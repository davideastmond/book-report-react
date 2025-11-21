import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { JSX } from "react";

type GroupedCourseListProps = {
  groupedCourses: GroupedCourseInfo[];
};
type GroupedCourseId = string;

export function GroupedCourseList({ groupedCourses }: GroupedCourseListProps) {
  return renderTable(groupedCourses) || null;
}

function renderTable(data: GroupedCourseInfo[]): JSX.Element[] | null {
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

      {sessions.map((session, index) => (
        <Link
          href={`/dashboard/admin/${session.courseSessionId}/stats`}
          key={index}
        >
          <Card
            key={session.courseSessionId}
            className={`${"hover:cursor-pointer "} hover:bg-list-hover/20 bg-slate-900 mt-4`}
          >
            <CardBody>
              <p className="font-bold">
                SessionId:
                <span className="font-thin">{session.courseSessionId}</span>
              </p>
              <p className="font-bold">
                Instructor:{" "}
                <span className="font-thin">
                  {session.courseSessionInstructorLastName}{" "}
                  {session.courseSessionInstructorFirstName?.slice(0, 1)}.
                </span>
              </p>
              <p className="font-bold">
                Duration:{" "}
                <span className="font-thin">
                  {new Date(session.courseSessionStart!).toLocaleDateString()} -{" "}
                  {new Date(session.courseSessionEnd!).toLocaleDateString()}
                </span>
              </p>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  ));
}
