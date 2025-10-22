"use client";
import { CourseSessionsAPIResponse } from "@/lib/types/db/course-session-info";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useRouter } from "next/navigation";

type CoursesSessionsListProps = {
  coursesSessions?: CourseSessionsAPIResponse;
  linkable?: boolean;
  enrolled?: {
    show: boolean;
    count: number;
  };
};

export function CoursesSessionsList({
  coursesSessions,
  linkable,
  enrolled,
}: CoursesSessionsListProps) {
  const router = useRouter();
  if (!coursesSessions || coursesSessions.length === 0) {
    return <p>No course sessions found.</p>;
  }
  return (
    <div className="flex flex-wrap gap-6">
      {coursesSessions &&
        [...coursesSessions]
          .sort((a, b) => {
            if (a.courseCode! > b.courseCode!) return 1;
            if (a.courseCode! < b.courseCode!) return -1;
            return 0;
          })
          .map((session) => (
            <Card
              className={`bg-gray-900 p-3 rounded-md mb-2 w-full ${
                linkable ? "cursor-pointer hover:shadow-lg" : ""
              }`}
              key={session.courseId}
            >
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">{session.courseName}</p>
                  <p className="text-small text-default-500">
                    {session.courseCode}
                  </p>
                  <p>
                    <span className="font-bold">Instructor: </span>
                    {session.instructorLastName?.toLocaleUpperCase()}
                    {", "}
                    {session.instructorFirstName
                      ?.slice(0, 1)
                      .toLocaleUpperCase()}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody
                data-testid="course-session-card-body"
                onClick={() => {
                  if (!linkable) return;
                  router.push(
                    `/dashboard/courses-sessions/view?id=${session.courseSessionId}`
                  );
                }}
              >
                <div className="flex flex-col">
                  <p className="font-thin">
                    <span className="font-bold">Starts:</span>{" "}
                    {new Date(session.sessionStart!).toLocaleDateString()}
                  </p>
                  <p className="font-thin">
                    <span className="font-bold">Ends:</span>{" "}
                    {new Date(session.sessionEnd!).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-bold">Allotment: </span>
                    <span className=" text-amber-300">
                      {session.studentAllotment}
                    </span>
                  </p>
                  <p className="text-amber-300">
                    {session.isCompleted ? "Y" : ""}
                  </p>
                  {enrolled && enrolled.show && (
                    <p>
                      <span className="font-bold ">Enrolled: </span>
                      <span className=" text-amber-300">{enrolled.count}</span>
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
    </div>
  );
}
